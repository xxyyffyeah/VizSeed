/**
 * VChart柱状图/条形图初始化模块
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VChart柱状图/条形图初始化（支持多种类型）
export const initVChartBar: PipelineStep = (spec: any, context: PipelineContext) => {
  const chartType = 'bar';
  const encodes = context.encodes[0] || {};
  
  // 根据图表类型设置不同的字段映射
  const baseSpec = {
    ...spec,
    type: chartType,
    direction: 'horizontal',
    xField: encodes.x || encodes.category || 'category',
    yField: encodes.y || encodes.value || 'value',
    seriesField: encodes.group || 'group',
  };

  return baseSpec;
};