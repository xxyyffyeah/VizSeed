/**
 * VChart散点图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../../PipelineCore';

// VChart散点图初始化
export const initVChartScatter: PipelineStep = (spec: any, context: PipelineContext) => {
  const encodes = context.encodes[0] || {};
  
  return {
    ...spec,
    type: 'scatter',
    xField: encodes.x || 'x',
    yField: encodes.y || 'y',
    seriesField: encodes.color || encodes.group
  };
};