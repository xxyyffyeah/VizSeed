/**
 * VizSeed DataMap处理模块
 * 负责处理数据重塑后的dataMap更新
 */

import { PipelineStep, PipelineContext } from '../PipelineCore';
import { dataReshapeStep } from './DataReshapeModule';

/**
 * DataMap更新步骤
 * 执行数据重塑并更新dataMap
 */
export const vizSeedDataMapStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const result = dataReshapeStep(vizSeed, context);
  
  // 直接使用原始数据作为dataMap，因为新的纯函数Pipeline不维护context状态
  const dataMap = context.data?.rows || [];
  
  return {
    ...vizSeed,
    dataMap, // 更新dataMap
    reshapeInfo: result.reshapeInfo // 保留重塑信息用于fieldMap更新
  };
};