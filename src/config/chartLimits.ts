import { ChartType, ChartSubType } from '../types/charts';
import { ChartLibrary } from '../types/specs';

export const CHART_TYPE_LIMITS: Record<ChartLibrary, ChartType[]> = {
  vchart: ['bar', 'column', 'area', 'line', 'scatter', 'pie'],
  echarts: ['bar', 'column', 'area', 'line', 'scatter', 'pie'],
  vtable: ['table']
};

export const CHART_SUBTYPE_LIMITS: Record<ChartType, ChartSubType[]> = {
  bar: ['grouped', 'stacked', 'percent'],
  column: ['grouped', 'stacked', 'percent'],
  area: ['stacked', 'percent'],
  line: [],
  scatter: ['linear', 'grouped'],
  pie: [],
  donut: [], // 保留定义但不在CHART_TYPE_LIMITS中使用
  table: []
};