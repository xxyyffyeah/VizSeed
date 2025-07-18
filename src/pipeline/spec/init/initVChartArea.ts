/**
 * VChart面积图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VChart面积图初始化
export const initVChartArea: PipelineStep = (spec: any, context: PipelineContext) => {
  const { encodes } = context;
  const mapping = encodes[0] || {};
  
  return {
    ...spec,
    type: 'area',
    xField: mapping.x || 'category',
    yField: mapping.y || 'value',
    seriesField: mapping.color || mapping.group
  };
};