/**
 * VChart折线图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../../PipelineCore';

// VChart折线图初始化
export const initVChartLine: PipelineStep = (spec: any, context: PipelineContext) => {
  const { chartConfig } = context;
  const mapping = chartConfig?.mapping || {};
  
  return {
    ...spec,
    type: 'line',
    xField: mapping.x || 'category',
    yField: mapping.y || 'value',
    seriesField: mapping.color || mapping.group
  };
};