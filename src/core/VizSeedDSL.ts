import { VizSeedDSL as IVizSeedDSL } from '../types';
import { DataSet, DataTransformation } from '../types/data';
import { ChartConfig } from '../types/charts';

export class VizSeedDSL implements IVizSeedDSL {
  public data: DataSet;
  public transformations: DataTransformation[];
  public chartConfig: ChartConfig;
  public visualStyle?: {
    title?: string;
    description?: string;
    legend?: boolean;
    label?: boolean;
    tooltip?: boolean;
  };

  constructor(
    data: DataSet,
    chartConfig: ChartConfig,
    transformations: DataTransformation[] = [],
    visualStyle?: IVizSeedDSL['visualStyle']
  ) {
    this.data = data;
    this.chartConfig = chartConfig;
    this.transformations = transformations;
    this.visualStyle = visualStyle;
  }

  public validate(): boolean {
    return this.validateData() && this.validateChartConfig();
  }

  private validateData(): boolean {
    return this.data.fields.length > 0 && this.data.rows.length > 0;
  }

  private validateChartConfig(): boolean {
    const { mapping, type } = this.chartConfig;
    if (!mapping) return false;
    
    // 表格类型允许没有通道映射
    if (type === 'table') return true;
    
    // 其他类型至少需要一个通道映射
    const setChannels = Object.values(mapping).filter(v => v).length;
    return setChannels > 0;
  }

  public clone(): VizSeedDSL {
    return new VizSeedDSL(
      JSON.parse(JSON.stringify(this.data)),
      JSON.parse(JSON.stringify(this.chartConfig)),
      JSON.parse(JSON.stringify(this.transformations)),
      this.visualStyle ? JSON.parse(JSON.stringify(this.visualStyle)) : undefined
    );
  }
}