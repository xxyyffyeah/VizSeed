/**
 * VChart折线图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VChart折线图初始化
export const initVChartLine: PipelineStep = (spec: any, context: PipelineContext) => {
  const encodes = context.encodes[0] || {};
  
  return {
    ...spec,
    type: 'line',
    xField: encodes.x || 'category',
    yField: encodes.y || 'value',
    seriesField: encodes.color || encodes.group
  };
};