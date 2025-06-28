import { VizSeedDSL as IVizSeedDSL, VTableSpec, VChartSpec } from '../types';
import { DataSet, DataTransformation } from '../types/data';
import { ChartConfig } from '../types/charts';

export class VizSeedDSL implements IVizSeedDSL {
  public data: DataSet;
  public transformations: DataTransformation[];
  public chartConfig: ChartConfig;
  public metadata?: {
    title?: string;
    description?: string;
    theme?: string;
    width?: number;
    height?: number;
  };

  constructor(
    data: DataSet,
    chartConfig: ChartConfig,
    transformations: DataTransformation[] = [],
    metadata?: IVizSeedDSL['metadata']
  ) {
    this.data = data;
    this.chartConfig = chartConfig;
    this.transformations = transformations;
    this.metadata = metadata;
  }

  public validate(): boolean {
    return this.validateData() && this.validateChartConfig();
  }

  private validateData(): boolean {
    return this.data.fields.length > 0 && this.data.rows.length > 0;
  }

  private validateChartConfig(): boolean {
    const { dimensions, measures } = this.chartConfig;
    return dimensions.length > 0 || measures.length > 0;
  }

  public clone(): VizSeedDSL {
    return new VizSeedDSL(
      JSON.parse(JSON.stringify(this.data)),
      JSON.parse(JSON.stringify(this.chartConfig)),
      JSON.parse(JSON.stringify(this.transformations)),
      this.metadata ? JSON.parse(JSON.stringify(this.metadata)) : undefined
    );
  }
}