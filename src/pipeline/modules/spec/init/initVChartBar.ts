/**
 * VChart柱状图/条形图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../../PipelineCore';

// VChart柱状图/条形图初始化（支持多种类型）
export const initVChartBar: PipelineStep = (spec: any, context: PipelineContext) => {
  const { chartConfig } = context;
  const chartType = chartConfig?.type || 'bar';
  const mapping = chartConfig?.mapping || {};
  
  // 根据图表类型设置不同的字段映射
  const baseSpec = {
    ...spec,
    type: chartType,
    xField: mapping.x || mapping.category || 'category',
    yField: mapping.y || mapping.value || 'value',
  };

  // 为支持分组/颜色的图表类型添加seriesField
  if (['bar', 'column', 'line', 'area'].includes(chartType)) {
    baseSpec.seriesField = mapping.color || mapping.group;
  }

  return baseSpec;
};