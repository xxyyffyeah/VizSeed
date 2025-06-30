/**
 * 样式处理模块
 * 可重用的Pipeline步骤，用于处理图表样式配置
 */

import { PipelineStep, PipelineContext } from '../PipelineBuilder';

// 图例配置步骤
export const configureLegend: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  if (!vizSeed?.visualStyle?.legend) return spec;

  return {
    ...spec,
    legends: {
      visible: vizSeed.visualStyle.legend.visible ?? true,
      orient: 'right',
      position: 'middle'
    }
  };
};

// 标签配置步骤
export const configureLabel: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  if (!vizSeed?.visualStyle?.label) return spec;

  return {
    ...spec,
    label: {
      visible: vizSeed.visualStyle.label.visible ?? true
    }
  };
};

// 工具提示配置步骤
export const configureTooltip: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  if (!vizSeed?.visualStyle?.tooltip) return spec;

  return {
    ...spec,
    tooltip: {
      visible: vizSeed.visualStyle.tooltip.visible ?? true
    }
  };
};

// 坐标轴配置步骤
export const configureAxes: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  
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