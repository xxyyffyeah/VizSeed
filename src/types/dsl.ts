import { DataSet } from './data';
import { ChartConfig, ChartType } from './charts';
import { ChartSpec } from './specs';

export interface DimensionOperation {
  type: 'elevate' | 'reduce' | 'group_elevate' | 'group_reduce';
  field: string;
  targetField?: string;
  groupBy?: string[];
  aggregation?: string;
}

export interface VizSeedBuilder {
  // 字段选择API
  setDimensions(dimensions: string[]): VizSeedBuilder;
  setMeasures(measures: string[]): VizSeedBuilder;
  addDimensionToArray(dimension: string): VizSeedBuilder;
  addMeasureToArray(measure: string): VizSeedBuilder;
  getDimensions(): string[];
  getMeasures(): string[];
  
  setChartType(type: ChartType): VizSeedBuilder;
  
  // 通道映射方法
  setXField(field: string): VizSeedBuilder;
  setYField(field: string): VizSeedBuilder;
  setColorField(field: string): VizSeedBuilder;
  setCategoryField(field: string): VizSeedBuilder;
  setValueField(field: string): VizSeedBuilder;
  setRowDimension(field: string): VizSeedBuilder;
  setColumnDimension(field: string): VizSeedBuilder;
  setMeasureField(field: string): VizSeedBuilder;
  
  // 返回函数式pipeline构建的对象
  build(): any;
  buildSpec(): ChartSpec;
}