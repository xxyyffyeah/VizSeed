/**
 * 数据重塑模块 - 使用Pipeline子模块实现维度重塑
 * 基于fieldMap和图表要求，在pipeline中修改数据结构
 */

import { PipelineStep, PipelineContext, FieldSelection } from '../PipelineCore';
import { CHART_DATA_REQUIREMENTS } from '../../types/charts';
import { field } from '@visactor/vchart/esm/util';

// 重塑结果接口
export interface DataReshapeResult {
  reshapeType: 'elevate' | 'reduce' | 'composite' | 'none';
  reshapeInfo?: {
    strategy: string;
    steps: string[];
    operations: any[];
  };
}

// 获取数据源的辅助函数
const getDataSource = (vizSeed: any, context: PipelineContext): any[] => {
  // 优先使用dataMap，如果为空则使用data.rows
  if(vizSeed.dataMap && vizSeed.dataMap.length > 0){
    return vizSeed.dataMap;
  }
  if (context.dataMap && context.dataMap.length > 0) {
    return context.dataMap;
  }
  return context.data?.rows || [];
};

// 获取字段选择的辅助函数
const getFieldSelection = (context: PipelineContext): FieldSelection => {
  return context.fieldSelection || { dimensions: [], measures: [] };
};

// 更新fieldMap的辅助函数
const updateFieldMapAndFieldSelection = (context: PipelineContext, newFieldSelection: FieldSelection) => {
  if (context.fieldMap) {
    // 更新fieldMap中的字段位置
    Object.keys(context.fieldMap).forEach(key => {
      if (newFieldSelection.dimensions.includes(key)) {
        context.fieldMap![key].location = 'dimension';
      } else if (newFieldSelection.measures.includes(key)) {
        context.fieldMap![key].location = 'measure';
      }
    });
    
    // 添加新字段（如升维产生的特殊字段）
    newFieldSelection.dimensions.forEach(dim => {
      if (!context.fieldMap![dim]) {
        context.fieldMap![dim] = {
          id: dim,
          type: 'string',
          alias: dim,
          location: 'dimension'
        };
      }
    });
    
    newFieldSelection.measures.forEach(measure => {
      if (!context.fieldMap![measure]) {
        context.fieldMap![measure] = {
          id: measure,
          type: 'number',
          alias: measure,
          location: 'measure'
        };
      }
    });
  }
  if(context.fieldSelection){
    context.fieldSelection = newFieldSelection;
  }
};

/**
 * 升维Pipeline子模块：将多指标转为单指标+指标名称维度
 */
export const elevateStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const sourceData = getDataSource(vizSeed,context);
  const fieldSelection = getFieldSelection(context);
  
  // 检查是否需要升维
  if (fieldSelection.measures.length <= vizSeed.analysisResult.targetStructure.idealDimensions) {
    return vizSeed;
  }

  const reshapedRows: any[] = [];
  const { dimensions, measures } = fieldSelection;

  // 为每个数据行，将多个指标转换为多行数据
  sourceData.forEach(row => {
    measures.forEach(measure => {
      const newRow: any = {};
      
      // 复制所有维度字段
      dimensions.forEach(dim => {
        newRow[dim] = row[dim];
      });
      
      // 添加特殊字段
      newRow['__MeasureName__'] = measure;
      newRow['__MeasureValue__'] = row[measure] || 0;
      
      reshapedRows.push(newRow);
    });
  });

  // 更新字段选择
  const newFieldSelection = {
    dimensions: [...dimensions, '__MeasureName__'],
    measures: ['__MeasureValue__']
  };
  
  // 更新fieldMap
  updateFieldMapAndFieldSelection(context, newFieldSelection);
  
  // 更新dataMap
  context.dataMap = reshapedRows;
  
  return {
    ...vizSeed,
    dataMap: context.dataMap,
    fieldSelection: context.fieldSelection,
    fieldMap: context.fieldMap,
    reshapeInfo: {
        reshapeType: 'elevate',
      }
  };
};

/**
 * 降维Pipeline子模块：将某个维度的值变成指标
 */
export const reduceStep: PipelineStep = (vizSeed: any, context: PipelineContext, targetDimension?: string) => {
  const sourceData = getDataSource(vizSeed, context);
  const fieldSelection = getFieldSelection(context);
  
  // 检查是否需要降维
  if (fieldSelection.dimensions.length <= vizSeed.analysisResult.targetStructure.idealDimensions - 1) {
    return vizSeed;
  }

  const { dimensions, measures } = fieldSelection;
  const dimToReduce = targetDimension || dimensions[dimensions.length - 1];
  const remainingDimensions = dimensions.filter(dim => dim !== dimToReduce);
  
  // 获取该维度的所有可能值
  const dimValues = [...new Set(sourceData.map(row => row[dimToReduce]))];
  
  // 构建新的数据结构
  const reshapedRows: any[] = [];
  
  // 按剩余维度分组
  const groupedData = sourceData.reduce((groups, row) => {
    const groupKey = remainingDimensions.map(dim => row[dim]).join('|');
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(row);
    return groups;
  }, {} as Record<string, any[]>);

  // 为每个组创建新的行
  Object.entries(groupedData).forEach(([, groupRows]) => {
    const rows = groupRows as any[];
    const newRow: any = {};
    
    // 设置剩余维度的值
    if (remainingDimensions.length > 0) {
      const firstRow = rows[0];
      remainingDimensions.forEach(dim => {
        newRow[dim] = firstRow[dim];
      });
    }
    
    // 为每个维度值创建新的指标列
    dimValues.forEach(dimValue => {
      const matchingRow = rows.find((row: any) => row[dimToReduce] === dimValue);
      
      // 为每个原始指标创建新的列名
      measures.forEach(measure => {
        const newColumnName = `${dimValue}_${measure}`;
        newRow[newColumnName] = matchingRow ? (matchingRow[measure] || 0) : 0;
      });
    });
    
    reshapedRows.push(newRow);
  });

  // 生成新的指标列表
  const newMeasures: string[] = [];
  dimValues.forEach(dimValue => {
    measures.forEach(measure => {
      newMeasures.push(`${dimValue}_${measure}`);
    });
  });
  
  // 更新字段选择
  const newFieldSelection = {
    dimensions: remainingDimensions,
    measures: newMeasures
  };
  
  // 更新fieldMap
  updateFieldMapAndFieldSelection(context, newFieldSelection);
  
  // 更新dataMap
  context.dataMap = reshapedRows;
  
  return {
    ...vizSeed,
    dataMap: context.dataMap,
    fieldSelection: context.fieldSelection,
    fieldMap: context.fieldMap,
    reshapeInfo: {
      reshapeType: 'reduce'
    }
  };
};

/**
 * 数据重塑Pipeline步骤 - 使用子模块实现智能重塑
 */
export const dataReshapeStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const { data, chartConfig } = context;
  
  if (!data?.rows || !chartConfig?.type) {
    return vizSeed;
  }

  // 初始化dataMap（如果为空）
  if (!context.dataMap || context.dataMap.length === 0) {
    context.dataMap = [...data.rows];
  }

  const fieldSelection = getFieldSelection(context);
  
  // 获取图表要求
  const requirement = CHART_DATA_REQUIREMENTS[chartConfig.type as keyof typeof CHART_DATA_REQUIREMENTS];
  
  if (!requirement) {
    return {
      ...vizSeed,
      dataMap: context.dataMap,
      reshapeInfo: {
        reshapeType: 'none',
        reason: '未找到图表类型的数据要求'
      }
    };
  }

  let currentDims = fieldSelection.dimensions.length;
  let currentMeas = fieldSelection.measures.length;
  const targetDims = requirement.idealDimensions;
  const targetMeas = requirement.idealMeasures;
  
  // 如果当前结构已经符合要求
  if (currentDims === targetDims && currentMeas === targetMeas) {
    return {
      ...vizSeed,
      dataMap: context.dataMap,
      reshapeInfo: {
        reshapeType: 'none'
      }
    };
  }

  const operations: string[] = [];

  // 步骤0: 如果指标过多，使用升维子模块

  // vizSeed = elevateStep(vizSeed, context);
  // currentDims = getFieldSelection(context).dimensions.length;
  // currentMeas = getFieldSelection(context).measures.length;
  // operations.push('elevate');



  // 步骤1: 如果维度过多，使用降维子模块
  if (currentDims > targetDims) {
    let currentFieldSelection = getFieldSelection(context);
    
    // 多次降维直到达到目标维度数
    while (currentFieldSelection.dimensions.length > targetDims) {
      const beforeLength = currentFieldSelection.dimensions.length;
      vizSeed = reduceStep(vizSeed, context);
      
      // 检查是否实际进行了降维
      const afterFieldSelection = getFieldSelection(context);
      if (afterFieldSelection.dimensions.length >= beforeLength) {
        break; // 防止无限循环
      }
      
      currentFieldSelection = afterFieldSelection;
      operations.push('reduce');
    }
  }

  // 步骤2: 如果指标过多，使用升维子模块
  const finalFieldSelection = getFieldSelection(context);
  if (finalFieldSelection.measures.length > targetMeas) {
    vizSeed = elevateStep(vizSeed, context);
    operations.push('elevate');
  }

  // 设置重塑信息
  const finalReshapeType = operations.length === 1 ? 
    (operations[0] as 'elevate' | 'reduce') : 
    (operations.length > 1 ? 'composite' : 'none');

  return {
    ...vizSeed,
    dataMap: context.dataMap,
    reshapeInfo: {
      strategy: `${currentDims}维度${currentMeas}指标 → ${targetDims}维度${targetMeas}指标`,
      steps: operations,
      reshapeType: finalReshapeType
    }
  };
};

