/**
 * 数据重塑模块 - 直接操作data.rows实现维度重塑
 * 基于fieldMap和图表要求，在pipeline中修改数据结构
 */

import { PipelineStep, PipelineContext, FieldSelection } from '../PipelineCore';
import { CHART_DATA_REQUIREMENTS } from './ChartAdapterModule';

// 重塑结果接口
export interface DataReshapeResult {
  rows: any[];                    // 重塑后的数据行
  currentFieldSelection: FieldSelection;      // 当前数据结构的字段选择
  reshapeType: 'elevate' | 'reduce' | 'composite' | 'none';
  reshapeInfo?: {
    originalFieldSelection: FieldSelection;
    strategy: string;
    steps: string[];
    operations: any[];
  };
}

/**
 * 升维操作：直接修改data.rows，将多指标转为单指标+指标名称维度
 */
export const elevateDataRows = (
  rows: any[],
  fieldSelection: FieldSelection
): DataReshapeResult => {
  if (fieldSelection.measures.length <= 1) {
    return {
      rows,
      currentFieldSelection: fieldSelection,
      reshapeType: 'none'
    };
  }

  const reshapedRows: any[] = [];
  const { dimensions, measures } = fieldSelection;

  // 为每个数据行，将多个指标转换为多行数据
  rows.forEach(row => {
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

  return {
    rows: reshapedRows,
    currentFieldSelection: {
      dimensions: [...dimensions, '__MeasureName__'],
      measures: ['__MeasureValue__']
    },
    reshapeType: 'elevate',
    reshapeInfo: {
      originalFieldSelection: fieldSelection,
      strategy: 'elevate',
      steps: ['elevate'],
      operations: [{ type: 'elevate', fields: measures }]
    }
  };
};

/**
 * 降维操作：直接修改data.rows，将某个维度的值变成指标
 */
export const reduceDataRows = (
  rows: any[],
  fieldSelection: FieldSelection,
  targetDimension?: string
): DataReshapeResult => {
  if (fieldSelection.dimensions.length <= 1) {
    return {
      rows,
      currentFieldSelection: fieldSelection,
      reshapeType: 'none'
    };
  }

  const { dimensions, measures } = fieldSelection;
  const dimToReduce = targetDimension || dimensions[dimensions.length - 1];
  const remainingDimensions = dimensions.filter(dim => dim !== dimToReduce);
  
  // 获取该维度的所有可能值
  const dimValues = [...new Set(rows.map(row => row[dimToReduce]))];
  
  // 构建新的数据结构
  const reshapedRows: any[] = [];
  
  // 按剩余维度分组
  const groupedData = rows.reduce((groups, row) => {
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

  return {
    rows: reshapedRows,
    currentFieldSelection: {
      dimensions: remainingDimensions,
      measures: newMeasures
    },
    reshapeType: 'reduce',
    reshapeInfo: {
      originalFieldSelection: fieldSelection,
      strategy: 'reduce',
      steps: ['reduce'],
      operations: [{ type: 'reduce', dimension: dimToReduce, values: dimValues }]
    }
  };
};

/**
 * 智能数据重塑：根据图表要求自动选择重塑策略
 */
export const smartDataReshape = (
  rows: any[],
  fieldSelection: FieldSelection,
  chartType: string
): DataReshapeResult => {
  const requirement = CHART_DATA_REQUIREMENTS[chartType as keyof typeof CHART_DATA_REQUIREMENTS];
  
  if (!requirement) {
    return {
      rows,
      currentFieldSelection: fieldSelection,
      reshapeType: 'none'
    };
  }

  const currentDims = fieldSelection.dimensions.length;
  const currentMeas = fieldSelection.measures.length;
  const targetDims = requirement.idealDimensions;
  const targetMeas = requirement.idealMeasures;

  let result: DataReshapeResult;
  const operations: any[] = [];

  // 如果当前结构已经符合要求
  if (currentDims === targetDims && currentMeas === targetMeas) {
    return {
      rows,
      currentFieldSelection: fieldSelection,
      reshapeType: 'none'
    };
  }

  // 初始化结果
  result = {
    rows: [...rows],
    currentFieldSelection: { ...fieldSelection },
    reshapeType: 'composite'
  };

  // 步骤1: 如果维度过多，先降维
  if (currentDims > targetDims) {
    let currentRows = result.rows;
    let currentSelection = result.currentFieldSelection;
    
    // 多次降维直到达到目标维度数
    while (currentSelection.dimensions.length > targetDims) {
      const reduceResult = reduceDataRows(
        currentRows,
        currentSelection,
        currentSelection.dimensions[currentSelection.dimensions.length - 1]
      );
      
      if (reduceResult.reshapeType !== 'none') {
        currentRows = reduceResult.rows;
        currentSelection = reduceResult.currentFieldSelection;
        operations.push(...(reduceResult.reshapeInfo?.operations || []));
      } else {
        break;
      }
    }
    
    result.rows = currentRows;
    result.currentFieldSelection = currentSelection;
  }

  // 步骤2: 如果指标过多，再升维
  if (result.currentFieldSelection.measures.length > targetMeas) {
    const elevateResult = elevateDataRows(result.rows, result.currentFieldSelection);
    
    if (elevateResult.reshapeType !== 'none') {
      result.rows = elevateResult.rows;
      result.currentFieldSelection = elevateResult.currentFieldSelection;
      operations.push(...(elevateResult.reshapeInfo?.operations || []));
    }
  }

  // 设置重塑信息
  const finalReshapeType = operations.length === 1 ? 
    (operations[0].type as 'elevate' | 'reduce') : 
    (operations.length > 1 ? 'composite' : 'none');

  result.reshapeType = finalReshapeType;
  result.reshapeInfo = {
    originalFieldSelection: fieldSelection,
    strategy: `${currentDims}维度${currentMeas}指标 → ${targetDims}维度${targetMeas}指标`,
    steps: operations.map(op => op.type),
    operations
  };

  return result;
};

/**
 * 数据重塑Pipeline步骤
 */
export const dataReshapeStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const { data, fieldSelection, chartConfig, reshapeConfig } = context;
  
  if (!data?.rows || !chartConfig?.type) {
    return vizSeed;
  }

  // 如果fieldSelection为空或没有字段，跳过重塑，直接使用原始数据
  if (!fieldSelection || 
      (fieldSelection.dimensions.length === 0 && fieldSelection.measures.length === 0)) {
    console.log(`⚠️ fieldSelection为空，跳过数据重塑，使用原始数据`);
    
    // 直接使用原始数据，不进行重塑
    const updatedContext = {
      ...context,
      dataMap: data.rows, // 使用原始数据
      fieldSelection: fieldSelection || { dimensions: [], measures: [] }
    };

    return {
      ...vizSeed,
      currentFieldSelection: fieldSelection || { dimensions: [], measures: [] },
      reshapeInfo: {
        reshapeType: 'none',
        reason: 'fieldSelection为空，使用原始数据'
      }
    };
  }

  let reshapeResult: DataReshapeResult;

  // 根据重塑配置选择策略
  if (reshapeConfig?.strategy === 'elevate') {
    // 手动升维
    reshapeResult = elevateDataRows(data.rows, fieldSelection);
  } else if (reshapeConfig?.strategy === 'reduce') {
    // 手动降维
    reshapeResult = reduceDataRows(data.rows, fieldSelection, reshapeConfig.targetDimension);
  } else if (reshapeConfig?.enabled === false) {
    // 禁用重塑
    reshapeResult = {
      rows: data.rows,
      currentFieldSelection: fieldSelection,
      reshapeType: 'none'
    };
  } else {
    // 智能重塑（默认）
    reshapeResult = smartDataReshape(data.rows, fieldSelection, chartConfig.type);
  }

  // 更新context中的dataMap和fieldSelection
  const updatedContext = {
    ...context,
    dataMap: reshapeResult.rows, // 将重塑后的数据放入dataMap
    fieldSelection: reshapeResult.currentFieldSelection
  };

  return {
    ...vizSeed,
    currentFieldSelection: reshapeResult.currentFieldSelection,
    reshapeInfo: {
      ...reshapeResult.reshapeInfo,
      reshapeType: reshapeResult.reshapeType
    }
  };
};