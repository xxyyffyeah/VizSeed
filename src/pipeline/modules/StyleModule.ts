/**
 * 样式处理模块
 * 可重用的Pipeline步骤，用于处理图表样式配置
 */

import { PipelineStep, PipelineContext } from '../PipelineCore';

// 图例配置步骤
export const configureLegend: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;
  if (!visualStyle) return spec;

  return {
    ...spec,
    legends: {
      visible: visualStyle.legend !== false,
      orient: 'right',
      position: 'middle'
    }
  };
};

// 标签配置步骤
export const configureLabel: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;
  if (!visualStyle) return spec;

  return {
    ...spec,
    label: {
      visible: visualStyle.label !== false
    }
  };
};

// 工具提示配置步骤
export const configureTooltip: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;
  if (!visualStyle) return spec;

  return {
    ...spec,
    tooltip: {
      visible: visualStyle.tooltip !== false
    }
  };
};

// 坐标轴配置步骤
export const configureAxes: PipelineStep = (spec: any, context: PipelineContext) => {
  return {
    ...spec,
    axes: [
      {
        orient: 'bottom',
        type: 'band'
      },
      {
        orient: 'left',
        type: 'linear'
      }
    ]
  };
};