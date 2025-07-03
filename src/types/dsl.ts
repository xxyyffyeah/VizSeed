import { DataSet, DataTransformation } from './data';
import { ChartConfig, ChartType } from './charts';
import { ChartSpec } from './specs';

export interface VizSeedDSL {
  data: DataSet;
  transformations: DataTransformation[];
  chartConfig: ChartConfig;
  visualStyle?: {
    title?: string;
    description?: string;
    legend?: boolean;
    label?: boolean;
    tooltip?: boolean;
  };
}

export interface DimensionOperation {
  type: 'elevate' | 'reduce' | 'group_elevate' | 'group_reduce';
  field: string;
  targetField?: string;
  groupBy?: string[];
  aggregation?: string;
}

export interface VizSeedBuilder {
  elevate(field: string, targetField?: string): VizSeedBuilder;
  reduce(field: string, targetField?: string): VizSeedBuilder;
  groupElevate(field: string, groupBy: string[]): VizSeedBuilder;
  groupReduce(fields: string[], targetField?: string): VizSeedBuilder;
  
  setChartType(type: string): VizSeedBuilder;
  
  // 新的通道映射方法
  setXField(field: string): VizSeedBuilder;
  setYField(field: string): VizSeedBuilder;
  setColorField(field: string): VizSeedBuilder;
  setCategoryField(field: string): VizSeedBuilder;
  setValueField(field: string): VizSeedBuilder;
  setRowDimension(field: string): VizSeedBuilder;
  setColumnDimension(field: string): VizSeedBuilder;
  setMeasureField(field: string): VizSeedBuilder;
  
  // 废弃的方法（向后兼容）
  addDimension(field: string): VizSeedBuilder;
  addMeasure(field: string, aggregation?: string): VizSeedBuilder;
  
  // 返回函数式pipeline构建的对象
  build(): any;
  buildSpec(): ChartSpec;
}