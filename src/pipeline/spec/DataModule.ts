/**
 * 数据处理模块
 * 可重用的Pipeline步骤，用于处理数据转换和字段映射
 */

import { PipelineStep, PipelineContext } from '../PipelineCore';

// 数据初始化步骤
export const initData: PipelineStep = (spec: any, context: PipelineContext) => {
  const { data} = context;

  return {
    ...spec,
    data: [{
      id: 'VizSeedData',
      values: data,
    }]
  };
};


