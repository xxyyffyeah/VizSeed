/**
 * VChart饼图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../../PipelineCore';

// VChart饼图初始化
export const initVChartPie: PipelineStep = (spec: any, context: PipelineContext) => {
  const encodes = context.encodes[0] || {};
  
  return {
    ...spec,
    type: 'pie',
    categoryField: encodes.category || encodes.x || 'category',
    valueField: encodes.value || encodes.y || 'value'
  };
};