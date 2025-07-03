/**
 * 图表类型初始化模块
 * 可重用的Pipeline步骤，用于初始化不同类型的图表配置
 */

import { PipelineStep, PipelineContext } from '../PipelineBuilder';

// VChart图表初始化（支持多种类型）
export const initVChartBar: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed, chartConfig } = context;
  const chartType = chartConfig?.type || 'bar';
  
  // 根据图表类型设置不同的字段映射
  const baseSpec = {
    ...spec,
    type: chartType,
    xField: vizSeed?.visualChannel?.[0]?.x || 'category',
    yField: vizSeed?.visualChannel?.[0]?.y || 'value',
  };

  // 为支持分组/颜色的图表类型添加seriesField
  if (['bar', 'column', 'line', 'area'].includes(chartType)) {
    baseSpec.seriesField = vizSeed?.visualChannel?.[0]?.group;
  }

  return baseSpec;
};

// VChart饼图初始化
export const initVChartPie: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  
  return {
    ...spec,
    type: 'pie',
    categoryField: vizSeed?.visualChannel?.[0]?.x || 'category',
    valueField: vizSeed?.visualChannel?.[0]?.y || 'value'
  };
};

// VTable表格初始化
export const initVTableList: PipelineStep = (spec: any, context: PipelineContext) => {
  const { vizSeed } = context;
  
  // 根据数据生成列配置
  const columns: any[] = [];
  if (vizSeed?.fieldMap) {
    Object.entries(vizSeed.fieldMap).forEach(([key, field]: [string, any]) => {
      if (field.alias) {
        columns.push({
          field: key,
          title: field.alias,
          width: 120
        });
      }
    });
  }

  return {
    ...spec,
    type: 'list-table',
    columns,
    records: vizSeed?.datasets || []
  };
};