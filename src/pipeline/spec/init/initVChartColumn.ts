/**
 * VChart柱状图/条形图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VChart柱状图/条形图初始化（支持多种类型）
export const initVChartColumn: PipelineStep = (spec: any, context: PipelineContext) => {
  const chartType = 'bar';
  const encodes = context.encodes[0] || {};
  
  // 根据图表类型设置不同的字段映射
  const baseSpec = {
    ...spec,
    type: chartType,
    xField: encodes.x || encodes.category || 'category',
    yField: encodes.y || encodes.value || 'value',
  };

  // 为支持分组/颜色的图表类型添加seriesField
  if (['bar', 'column', 'line', 'area'].includes(chartType)) {
    baseSpec.seriesField = encodes.color || encodes.group;
  }

  return baseSpec;
};