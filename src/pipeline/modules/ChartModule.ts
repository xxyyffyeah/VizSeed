/**
 * 图表类型初始化模块
 * 可重用的Pipeline步骤，用于初始化不同类型的图表配置
 */

import { PipelineStep, PipelineContext } from '../PipelineCore';

// VChart图表初始化（支持多种类型）
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

// VChart饼图初始化
export const initVChartPie: PipelineStep = (spec: any, context: PipelineContext) => {
  const { chartConfig } = context;
  const mapping = chartConfig?.mapping || {};
  
  return {
    ...spec,
    type: 'pie',
    categoryField: mapping.category || mapping.x || 'category',
    valueField: mapping.value || mapping.y || 'value'
  };
};

// VTable表格初始化
export const initVTableList: PipelineStep = (spec: any, context: PipelineContext) => {
  const { data } = context;
  
  // 根据数据字段生成列配置
  const columns: any[] = [];
  if (data?.fields) {
    data.fields.forEach((field: any) => {
      if (field.name && !field.name.startsWith('__')) { // 排除内部字段
        columns.push({
          field: field.name,
          title: field.alias || field.name,
          width: 120
        });
      }
    });
  }

  return {
    ...spec,
    type: 'list-table',
    columns,
    records: data?.rows || []
  };
};