/**
 * 工具提示配置步骤
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// 工具提示配置步骤
export const configureTooltip: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;
  if (!visualStyle) return spec;

  return {
    ...spec,
    tooltip: {
      visible: visualStyle.tooltip !== false
    }
  };
};