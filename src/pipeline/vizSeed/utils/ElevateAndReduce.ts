/**
 * 升维和降维Pipeline子模块工具函数
 */

import { PipelineStep, PipelineContext, FieldSelection } from '../../PipelineCore';

// 获取数据源的辅助函数
const getDataSource = (vizSeed: any, context: PipelineContext): any[] => {
  return context.data || [];
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
  
  if(fieldSelection.measures.length <= 0) {
    return vizSeed; // 如果没有指标，直接返回
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
  
  // 更新data
  context.data = reshapedRows;
  
  return {
    ...vizSeed,
    data: context.data,
    fieldSelection: context.fieldSelection,
    fieldMap: context.fieldMap
  };
};

/**
 * 降维Pipeline子模块：将某个维度的值变成指标
 */
export const reduceStep: PipelineStep = (vizSeed: any, context: PipelineContext, targetDimension?: string) => {
  const sourceData = getDataSource(vizSeed, context);
  const fieldSelection = getFieldSelection(context);
  
  // 检查是否需要降维
  if (fieldSelection.dimensions.length <= 0) {
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
  
  // 更新data
  context.data = reshapedRows;
  
  return {
    ...vizSeed,
    data: context.data,
    fieldSelection: context.fieldSelection,
    fieldMap: context.fieldMap
  };
};