/**
 * 图例配置步骤
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// 图例配置步骤
export const configureLegend: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;
  if (!visualStyle) return spec;

  return {
    ...spec,
    legends: {
      visible: visualStyle.legend !== false,
      orient: 'right',
      position: 'middle'
    }
  };
};