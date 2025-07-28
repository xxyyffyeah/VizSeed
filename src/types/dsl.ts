import { DataSet } from './data';
import { ChartType } from './charts';
import { ChartSpec } from './specs';

export type NestedMeasure<T> = T | NestedMeasure<T>[]
export interface VizSeedBuilder {
  // 字段选择API
  setDimensions(dimensions: string[]): VizSeedBuilder;
  setMeasures(measures: NestedMeasure<string>[]): VizSeedBuilder; // 修正类型
  addDimensionToArray(dimension: string): VizSeedBuilder;
  addMeasureToArray(measure: string): VizSeedBuilder;
  getDimensions(): string[];
  getMeasures(): string[];
  
  setChartType(type: ChartType): VizSeedBuilder;
  
  // 通道映射方法已删除 - 使用自动通道映射
  
  // 返回函数式pipeline构建的对象
  build(): any;
  buildSpec(): ChartSpec;
}