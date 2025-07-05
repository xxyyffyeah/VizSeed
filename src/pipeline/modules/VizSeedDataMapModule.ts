/**
 * VizSeed DataMap处理模块
 * 负责处理数据重塑后的dataMap更新
 */

import { PipelineStep, PipelineContext, PipelineStepResult } from '../PipelineCore';
import { dataReshapeStep } from './DataReshapeModule';

/**
 * DataMap更新步骤
 * 执行数据重塑并更新dataMap
 */
export const vizSeedDataMapStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const result = dataReshapeStep(vizSeed, context);
  const updatedContext = result.context || context;
  
  // 获取重塑后的数据放入dataMap
  const dataMap = updatedContext.dataMap || context.data?.rows || [];
  
  return {
    result: {
      ...vizSeed,
      dataMap, // 更新dataMap
      reshapeInfo: result.reshapeInfo // 保留重塑信息用于fieldMap更新
    },
    context: updatedContext
  };
};