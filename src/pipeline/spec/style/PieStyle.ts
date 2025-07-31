/**
 * 配置Pie的style内容
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

export const configurePieStyle: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;
  if (!visualStyle) return spec;

  return {
    ...spec,
    ...visualStyle.pie
  };
};