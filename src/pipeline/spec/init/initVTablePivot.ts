/**
 * VTable透视表初始化模块
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VTable透视表初始化
export const initVTablePivot: PipelineStep = (spec: any, context: PipelineContext) => {
  const { encodes, data } = context;
  
  if (!encodes || encodes.length === 0) {
    return {
      ...spec,
      records: data || []
    };
  }
  
  const encode = encodes[0];
  const { rowDimension = [], columnDimension = [], measure = [] } = encode;
  
  // 构造透视表的rows配置（行维度）
  const rows: any[] = [];
  if (Array.isArray(rowDimension)) {
    rowDimension.forEach((fieldName: string) => {
      if (fieldName) {
        rows.push({
          dimensionKey: fieldName,
          title: fieldName,
          width: 'auto'
        });
      }
    });
  }
  
  // 构造透视表的columns配置（列维度）
  const columns: any[] = [];
  if (Array.isArray(columnDimension)) {
    columnDimension.forEach((fieldName: string) => {
      if (fieldName) {
        columns.push({
          dimensionKey: fieldName,
          title: fieldName,
          width: 'auto'
        });
      }
    });
  }
  
  // 构造透视表的indicators配置（指标）
  const indicators: any[] = [];
  if (Array.isArray(measure)) {
    measure.forEach((fieldName: string) => {
      if (fieldName) {
        indicators.push({
          indicatorKey: fieldName,
          title: fieldName,
          width: 'auto',
          format: (value: any) => {
            if (typeof value === 'number') {
              return value.toLocaleString();
            }
            return value;
          }
        });
      }
    });
  }
  
  return {
    ...spec,
    type: 'pivot-table',
    rows,
    columns, 
    indicators,
    records: data || [],
    corner: {
      titleOnDimension: 'row'
    },
    theme: 'DEFAULT'
  };
};