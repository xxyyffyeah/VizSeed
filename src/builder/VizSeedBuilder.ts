import { VizSeedBuilder as IVizSeedBuilder, VizSeedDSL as IVizSeedDSL } from '../types';
import { ChartSpec, ChartLibrary } from '../types/specs';
import { DataSet, DataTransformation, Dimension, Measure } from '../types/data';
import { ChartType, ChartSubType, ChartConfig } from '../types/charts';
import { VizSeedDSL } from '../core/VizSeedDSL';
import { DimensionOperator } from '../operations/DimensionOperator';
import { SpecBuilder } from '../specs/SpecBuilder';

export class VizSeedBuilder implements IVizSeedBuilder {
  private data: DataSet;
  private transformations: DataTransformation[] = [];
  private chartConfig: Partial<ChartConfig> = {
    dimensions: [],
    measures: []
  };
  private metadata: IVizSeedDSL['metadata'] = {};
  constructor(data: DataSet) {
    this.data = data;
  }

  public elevate(field: string, targetField?: string): VizSeedBuilder {
    const transformation = DimensionOperator.elevate(field, targetField);
    this.transformations.push(transformation);
    return this;
  }

  public reduce(field: string, targetField?: string): VizSeedBuilder {
    const transformation = DimensionOperator.reduce(field, targetField);
    this.transformations.push(transformation);
    return this;
  }

  public groupElevate(field: string, groupBy: string[]): VizSeedBuilder {
    const transformation = DimensionOperator.groupElevate(field, groupBy);
    this.transformations.push(transformation);
    return this;
  }

  public groupReduce(fields: string[], targetField?: string): VizSeedBuilder {
    const transformation = DimensionOperator.groupReduce(fields, targetField);
    this.transformations.push(transformation);
    return this;
  }

  public setChartType(type: ChartType, subType?: ChartSubType): VizSeedBuilder {
    this.chartConfig.type = type;
    this.chartConfig.subType = subType;
    return this;
  }

  public addDimension(field: string): VizSeedBuilder {
    if (!this.chartConfig.dimensions) {
      this.chartConfig.dimensions = [];
    }
    if (!this.chartConfig.dimensions.includes(field)) {
      this.chartConfig.dimensions.push(field);
    }
    return this;
  }

  public addMeasure(field: string, aggregation?: string): VizSeedBuilder {
    if (!this.chartConfig.measures) {
      this.chartConfig.measures = [];
    }
    if (!this.chartConfig.measures.includes(field)) {
      this.chartConfig.measures.push(field);
    }
    return this;
  }

  public setColor(field: string): VizSeedBuilder {
    this.chartConfig.color = field;
    return this;
  }

  public setSizeField(field: string): VizSeedBuilder {
    this.chartConfig.size = field;
    return this;
  }

  public setTitle(title: string): VizSeedBuilder {
    if (!this.metadata) this.metadata = {};
    this.metadata.title = title;
    return this;
  }

  public setTheme(theme: string): VizSeedBuilder {
    if (!this.metadata) this.metadata = {};
    this.metadata.theme = theme;
    return this;
  }

  public setDimensions(width: number, height: number): VizSeedBuilder {
    if (!this.metadata) this.metadata = {};
    this.metadata.width = width;
    this.metadata.height = height;
    return this;
  }

  public build(): IVizSeedDSL {
    this.validateConfig();
    
    return new VizSeedDSL(
      this.data,
      this.chartConfig as ChartConfig,
      this.transformations,
      this.metadata
    );
  }

  public buildSpec(library: ChartLibrary = 'vchart'): ChartSpec {
    const vizSeedDSL = this.build();
    const vizSeed = new VizSeedDSL(
      vizSeedDSL.data,
      vizSeedDSL.chartConfig,
      vizSeedDSL.transformations,
      vizSeedDSL.metadata
    );
    // 目前仅支持使用SpecBuilder生成规范，library参数暂时忽略
    return SpecBuilder.build(vizSeed);
  }

  public getSupportedLibraries(): ChartLibrary[] {
    // 暂时返回可用的库
    return ['vchart', 'vtable', 'echarts'];
  }

  public getSupportedChartTypes(library: ChartLibrary): ChartType[] {
    // 暂时返回基本的图表类型
    if (library === 'vtable') {
      return ['table'];
    }
    return ['bar', 'column', 'line', 'area', 'scatter', 'pie', 'donut'];
  }

  public getAllSupportedChartTypes(): Record<ChartLibrary, ChartType[]> {
    return {
      vchart: this.getSupportedChartTypes('vchart'),
      vtable: this.getSupportedChartTypes('vtable'),
      echarts: this.getSupportedChartTypes('echarts')
    };
  }

  private validateConfig(): void {
    if (!this.chartConfig.type) {
      throw new Error('图表类型未设置');
    }
    
    // 表格类型允许没有维度和指标
    if (this.chartConfig.type === 'table') {
      return;
    }
    
    if (!this.chartConfig.dimensions || this.chartConfig.dimensions.length === 0) {
      if (!this.chartConfig.measures || this.chartConfig.measures.length === 0) {
        throw new Error('至少需要设置一个维度或指标');
      }
    }
  }
}