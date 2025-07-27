/**
 * 坐标轴配置步骤
 * 基于功能设计，而非图表类型
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// 综合坐标轴配置步骤（旧的兼容性方法）
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

// X轴带状轴配置
export const xBandAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result = { ...spec };
  if (!result.axes) {
    result.axes = [];
  }

  result.axes.push({
    orient: 'bottom',
    type: 'band'
  });
  return result;
};

// X轴线性轴配置
export const xLinearAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result = { ...spec };
  if (!result.axes) {
    result.axes = [];
  }
  
  result.axes.push({
    orient: 'bottom',
    type: 'linear'
  });
  return result;
};

// Y轴线性轴配置
export const yLinearAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result = { ...spec };
  if (!result.axes) {
    result.axes = [];
  }

  result.axes.push({
    orient: 'left',
    type: 'linear'
  });
  return result;
};

// Y轴带状轴配置
export const yBandAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result = { ...spec };
  if (!result.axes) {
    result.axes = [];
  }

  result.axes.push({
    orient: 'left',
    type: 'band'
  });
  return result;
};

// 双Y轴线性配置
export const yyLinearAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result = { ...spec };
  if (!result.axes) {
    result.axes = [];
  }

  result.axes.push({
    orient: 'left',
    type: 'linear'
  });

  result.axes.push({
    orient: 'right',
    type: 'linear'
  });
  return result;
};