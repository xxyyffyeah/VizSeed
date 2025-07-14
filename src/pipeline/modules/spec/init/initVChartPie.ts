/**
 * VChart饼图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../../PipelineCore';

// VChart饼图初始化
export const initVChartPie: PipelineStep = (spec: any, context: PipelineContext) => {
  const { chartConfig } = context;
  const mapping = chartConfig?.mapping || {};
  
  return {
    ...spec,
    type: 'pie',
    categoryField: mapping.category || mapping.x || 'category',
    valueField: mapping.value || mapping.y || 'value'
  };
};