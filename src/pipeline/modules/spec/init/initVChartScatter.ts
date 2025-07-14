/**
 * VChart散点图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../../PipelineCore';

// VChart散点图初始化
export const initVChartScatter: PipelineStep = (spec: any, context: PipelineContext) => {
  const { chartConfig } = context;
  const mapping = chartConfig?.mapping || {};
  
  return {
    ...spec,
    type: 'scatter',
    xField: mapping.x || 'x',
    yField: mapping.y || 'y',
    seriesField: mapping.color || mapping.group
  };
};