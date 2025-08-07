/**
 * VTable透视图初始化模块
 * 支持在透视表单元格中嵌入VChart图表
 */

import { chartModule } from '@visactor/vtable/es/register';
import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VTable透视图初始化
export const initVTablePivotChart: PipelineStep = (spec: any, context: PipelineContext) => {
  const { encodes, data, fieldSelection } = context;
  const indicatorChartSpecs = fieldSelection?.indicatorChartSpecs || {};

  if (!encodes || encodes.length === 0) {
    return {
      ...spec,
      records: data || []
    };
  }

  const encode = encodes[0];
  const { rowDimension = [], columnDimension = [], measure = [] } = encode;

  // 构造透视图的rows配置（行维度）
  const rows: any[] = [];
  if (Array.isArray(rowDimension)) {
    rowDimension.forEach((fieldName: string) => {
      if (fieldName) {
        rows.push({
          dimensionKey: fieldName,
          title: fieldName
        });
      }
    });
  }

  // 构造透视图的columns配置（列维度）
  const columns: any[] = [];
  if (Array.isArray(columnDimension)) {
    columnDimension.forEach((fieldName: string) => {
      if (fieldName) {
        columns.push({
          dimensionKey: fieldName,
          title: fieldName
        });
      }
    });
  }

  // 构造透视图的indicators配置（指标 + 图表）
  const indicators: any[] = [];
  const recordsData: Record<string, any> = {};  // 存储每个指标的数据

  if (Array.isArray(measure)) {
    measure.forEach((fieldName: string, index: number) => {
      if (fieldName) {
        // 使用用户配置的完整图表规范，如果没有配置则使用默认配置
        let chartSpec: any;

        if (indicatorChartSpecs[fieldName]) {
          // 使用用户提供的完整图表规范
          chartSpec = { ...indicatorChartSpecs[fieldName] };

          // 提取数据到records中，并修改chartSpec中的data引用
          if (chartSpec.data && Array.isArray(chartSpec.data) && chartSpec.data[0]?.values) {
            recordsData[fieldName] = chartSpec.data[0].values;
            // 修改为引用records中的数据
            chartSpec.data = {
              id: fieldName
            };
          }
        } else {
          // 使用默认的简单配置
          const chartType = ['bar', 'line', 'area'][index % 3];
          chartSpec = {
            type: chartType,
            data: {
              id: fieldName,  // 使用指标名作为数据id
              fields: {
                [fieldName]: {
                  alias: fieldName
                }
              }
            },
            ...(chartType === 'bar' ? {
              xField: '_indicatorKey',
              yField: '_indicatorValue',
              seriesField: '_indicatorKey'
            } : chartType === 'line' ? {
              xField: '_indicatorKey',
              yField: '_indicatorValue',
              point: { visible: true }
            } : {
              // area chart
              xField: '_indicatorKey',
              yField: '_indicatorValue',
              stack: false
            }),
            axes: [
              {
                orient: 'bottom',
                type: 'band'
              },
              {
                orient: 'left',
                type: 'linear'
              }
            ],
            theme: 'light'
          };
          // 对于默认配置，也需要设置数据
          recordsData[fieldName] = data || [];
        }

        indicators.push({
          indicatorKey: fieldName,
          title: fieldName,
          width: 'auto',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec,
          style: {
            padding: 1
          }
        });
      }
    });
  }


  return {
    ...spec,
    type: 'pivot-chart',
    rows,
    columns,
    indicators,
    indicatorsAsCol: false,
    records: Object.keys(recordsData).length > 0 ? recordsData : data || [],
    corner: {
      titleOnDimension: 'row'
    },
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 50,
    defaultColWidth: 280,
    defaultHeaderColWidth: 100,
    indicatorTitle: 'Indicator',
    autoWrapText: true
  };
};