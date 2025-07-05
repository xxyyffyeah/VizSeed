/**
 * 数据处理模块
 * 可重用的Pipeline步骤，用于处理数据转换和字段映射
 */

import { PipelineStep, PipelineContext } from '../PipelineCore';

// 数据初始化步骤
export const initData: PipelineStep = (spec: any, context: PipelineContext) => {
  const { data } = context;
  if (!data) return spec;

  return {
    ...spec,
    data: data.rows || data
  };
};

// 字段映射步骤
export const mapFields: PipelineStep = (spec: any, context: PipelineContext) => {
  const { chartConfig } = context;
  if (!chartConfig || !chartConfig.mapping) return spec;

  const mapping = chartConfig.mapping;

  return {
    ...spec,
    xField: mapping.x || mapping.category,
    yField: mapping.y || mapping.value,
    seriesField: mapping.color || mapping.group
  };
};

