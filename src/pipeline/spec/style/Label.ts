/**
 * 标签配置步骤
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// 标签配置步骤
export const configureLabel: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;
  if (!visualStyle) return spec;

  return {
    ...spec,
    label: {
      visible: visualStyle.label !== false
    }
  };
};