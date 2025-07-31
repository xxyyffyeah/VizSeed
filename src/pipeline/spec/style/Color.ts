/**
 * 颜色配置步骤
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// 颜色配置步骤
export const configureColor: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;
  if (!visualStyle) return spec;

  return {
    ...spec,
    color: visualStyle.color 
  };
};