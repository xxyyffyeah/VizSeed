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
  addDimension(field: string): VizSeedBuilder;
  addMeasure(field: string, aggregation?: string): VizSeedBuilder;
  
  build(): VizSeedDSL;
  buildSpec(): ChartSpec;
}