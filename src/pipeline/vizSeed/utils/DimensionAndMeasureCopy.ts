/**
 * 维度和指标复制工具模块
 * 提供复制指定维度或指标字段的功能，新字段命名为原字段名_copy
 */

import { PipelineStep, PipelineContext, FieldSelection, FieldDefinition } from '../../PipelineCore';

// 获取数据源的辅助函数
const getDataSource = (vizSeed: any, context: PipelineContext): any[] => {
  // 优先使用data，如果为空则使用data.rows
  return context.data;
};

// 获取字段选择的辅助函数
const getFieldSelection = (context: PipelineContext): FieldSelection => {
  return context.fieldSelection || { dimensions: [], measures: [] };
};

// 更新fieldMap的辅助函数
const updateFieldMapAndFieldSelection = (context: PipelineContext, newFieldSelection: FieldSelection, originalField: FieldDefinition, copiedFieldName: string) => {
  if (context.fieldMap) {
    // 添加复制的字段到fieldMap
    if (!context.fieldMap![copiedFieldName]) {
      context.fieldMap![copiedFieldName] = {
        id: copiedFieldName,
        type: originalField.type,
        alias: copiedFieldName,
        location: originalField.location,
      };
    }
  }

  if (context.fieldSelection) {
    context.fieldSelection = newFieldSelection;
  }
};

/**
 * 复制指定维度字段的Pipeline步骤
 * @param vizSeed VizSeed对象
 * @param context Pipeline上下文
 * @param dimensionName 要复制的维度字段名称，如果不指定则复制第一个维度
 */
export const copyDimensionStep: PipelineStep = (vizSeed: any, context: PipelineContext, dimensionName?: string) => {
  const sourceData = getDataSource(vizSeed, context);
  const fieldSelection = getFieldSelection(context);
  
  // 检查是否有维度可复制
  if (fieldSelection.dimensions.length === 0) {
    return vizSeed;
  }
  
  // 确定要复制的维度
  const targetDimension = dimensionName || fieldSelection.dimensions[0];
  
  // 检查目标维度是否存在
  if (!fieldSelection.dimensions.includes(targetDimension)) {
    throw new Error(`维度字段 ${targetDimension} 不存在于当前字段选择中`);
  }
  
  const copiedFieldName = `${targetDimension}_copy`;
  
  // 复制数据并添加新字段
  const updatedRows = sourceData.map(row => ({
    ...row,
    [copiedFieldName]: row[targetDimension]
  }));
  
  // 更新字段选择，将复制的字段添加到维度列表
  const newFieldSelection = {
    dimensions: [...fieldSelection.dimensions, copiedFieldName],
    measures: [...fieldSelection.measures]
  };
  
  // 获取原字段类型
  const originalField = context.fieldMap?.[targetDimension];
  
  // 更新fieldMap和fieldSelection
  updateFieldMapAndFieldSelection(context, newFieldSelection, originalField, copiedFieldName);
  
  // 更新data
  context.data = updatedRows;
  
  return {
    ...vizSeed,
    data: context.data,
    fieldSelection: context.fieldSelection,
    fieldMap: context.fieldMap,
    copyInfo: {
      type: 'dimension',
      originalField: targetDimension,
      copiedField: copiedFieldName
    }
  };
};

/**
 * 复制指定指标字段的Pipeline步骤
 * @param vizSeed VizSeed对象
 * @param context Pipeline上下文
 * @param measureName 要复制的指标字段名称，如果不指定则复制第一个指标
 */
export const copyMeasureStep: PipelineStep = (vizSeed: any, context: PipelineContext, measureName?: string) => {
  const sourceData = getDataSource(vizSeed, context);
  const fieldSelection = getFieldSelection(context);
  
  // 检查是否有指标可复制
  if (fieldSelection.measures.length === 0) {
    return vizSeed;
  }
  
  // 确定要复制的指标
  const targetMeasure = measureName || fieldSelection.measures[0];
  
  // 检查目标指标是否存在
  if (!fieldSelection.measures.includes(targetMeasure)) {
    throw new Error(`指标字段 ${targetMeasure} 不存在于当前字段选择中`);
  }
  
  const copiedFieldName = `${targetMeasure}_copy`;
  
  // 复制数据并添加新字段
  const updatedRows = sourceData.map(row => ({
    ...row,
    [copiedFieldName]: row[targetMeasure]
  }));
  
  // 更新字段选择，将复制的字段添加到指标列表
  const newFieldSelection = {
    dimensions: [...fieldSelection.dimensions],
    measures: [...fieldSelection.measures, copiedFieldName]
  };
  
  // 获取原字段类型
  const originalField = context.fieldMap?.[targetMeasure];
  
  // 更新fieldMap和fieldSelection
  updateFieldMapAndFieldSelection(context, newFieldSelection, originalField, copiedFieldName);
  
  // 更新data
  context.data = updatedRows;
  
  return {
    ...vizSeed,
    data: context.data,
    fieldSelection: context.fieldSelection,
    fieldMap: context.fieldMap
  };
};