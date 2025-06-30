/**
 * 数据处理模块
 * 可重用的Pipeline步骤，用于处理数据转换和字段映射
 */

import { PipelineStep, PipelineContext } from '../PipelineBuilder';

// 数据初始化步骤
export const initData: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  if (!vizSeed) return spec;

  return {
    ...spec,
    data: vizSeed.datasets || vizSeed.data
  };
};

// 字段映射步骤
export const mapFields: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  if (!vizSeed || !vizSeed.visualChannel) return spec;

  const channels = Array.isArray(vizSeed.visualChannel) 
    ? vizSeed.visualChannel[0] 
    : vizSeed.visualChannel;

  return {
    ...spec,
    xField: channels.x,
    yField: channels.y,
    seriesField: channels.group || channels.color
  };
};

// 维度重塑数据处理
export const processDimensionData: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  if (!vizSeed) return spec;

  // 处理__MeasureValue__和__MeasureName__格式的数据
  if (vizSeed.datasets && vizSeed.datasets.some((item: any) => item.__MeasureValue__ !== undefined)) {
    return {
      ...spec,
      data: vizSeed.datasets,
      categoryField: vizSeed.visualChannel?.[0]?.x || 'category',
      valueField: '__MeasureValue__',
      seriesField: '__MeasureName__'
    };
  }

  return spec;
};