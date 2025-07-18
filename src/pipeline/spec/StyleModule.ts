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


// 基于功能设计， 而非图标类型。
export const xBandAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result ={ ...spec }
  if(!result.axes){
    result.axes = [];
  }

  result.axes.push({
    orient: 'bottom',
    type: 'band'
  });
  return result
}

export const xLinearAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result ={ ...spec }
  if(!result.axes){
    result.axes = [];
  } 
  result.axes.push({
    orient: 'bottom',
    type: 'linear'
  });
  return result
}

export const yLinaerAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result ={ ...spec }
  if(!result.axes){
    result.axes = [];
  }

  result.axes.push({
    orient: 'left',
    type: 'linear'
  });
  return result
}

export const yBandAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result ={ ...spec }
  if(!result.axes){
    result.axes = [];
  }

  result.axes.push({
    orient: 'left',
    type: 'band'
  });
  return result
}

export const yyLinearAxis: PipelineStep = (spec: any, context: PipelineContext) => {
  const result ={ ...spec }
  if(!result.axes){
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
  return result
}