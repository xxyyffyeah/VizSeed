/**
 * VizSeed FieldMap处理模块
 * 负责根据重塑结果更新fieldMap
 */

import { PipelineStep, PipelineContext } from '../PipelineCore';

/**
 * FieldMap更新步骤
 * 基于重塑结果添加新字段到fieldMap
 */
export const vizSeedFieldMapStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const originalFieldMap = context.fieldMap || {};
  const reshapeInfo = vizSeed.reshapeInfo;
  
  // 基于重塑结果添加新字段到fieldMap
  let updatedFieldMap = { ...originalFieldMap };
  
  if (reshapeInfo?.reshapeType === 'elevate' || reshapeInfo?.reshapeType === 'composite') {
    // 添加升维产生的特殊字段
    updatedFieldMap['__MeasureValue__'] = {
      id: '__MeasureValue__',
      type: 'number',
      alias: '指标值',
      location: 'measure',
      domain: [],
      format: {}
    };
    updatedFieldMap['__MeasureName__'] = {
      id: '__MeasureName__',
      type: 'string',
      alias: '指标名称',
      location: 'dimension',
      domain: [],
      format: {}
    };
  }
  
  if (reshapeInfo?.reshapeType === 'reduce' || reshapeInfo?.reshapeType === 'composite') {
    // 添加降维产生的新指标字段
    const updatedContext = vizSeed.reshapeInfo?.context || context;
    const currentFieldSelection = updatedContext.fieldSelection;
    if (currentFieldSelection?.measures) {
      currentFieldSelection.measures.forEach((measure: string) => {
        if (!updatedFieldMap[measure]) {
          updatedFieldMap[measure] = {
            id: measure,
            type: 'number',
            alias: measure,
            location: 'measure',
            domain: [],
            format: {}
          };
        }
      });
    }
  }
  
  return {
    ...vizSeed,
    fieldMap: updatedFieldMap
  };
};