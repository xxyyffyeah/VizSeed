/**
 * VChart饼图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VChart饼图初始化
export const initVChartDonut: PipelineStep = (spec: any, context: PipelineContext) => {
  const encodes = context.encodes[0] || {};
  
  return {
    ...spec,
    type: 'pie',
    categoryField: encodes.category || encodes.x || 'category',
    valueField: encodes.value || encodes.y || 'value',
    outerRadius: 0.8,
    innerRadius: 0.5,
    padAngle: 0.6
  };
};