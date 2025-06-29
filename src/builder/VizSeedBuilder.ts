import { VizSeedBuilder as IVizSeedBuilder, VizSeedDSL as IVizSeedDSL } from '../types';
import { ChartSpec, ChartLibrary } from '../types/specs';
import { DataSet as IDataSet, DataTransformation, Dimension, Measure, FieldInferenceOptions } from '../types/data';
import { ChartType, ChartSubType, ChartConfig } from '../types/charts';
import { VizSeedDSL } from '../core/VizSeedDSL';
import { DataSet } from '../core/DataSet';
import { DimensionOperator } from '../operations/DimensionOperator';
import { SpecGenerator } from '../specs/SpecGenerator';
import { CHART_TYPE_LIMITS } from '../config/chartLimits';

export class VizSeedBuilder implements IVizSeedBuilder {
  private data: IDataSet;
  private transformations: DataTransformation[] = [];
  private chartConfig: Partial<ChartConfig> = {
    dimensions: [],
    measures: []
  };
  private metadata: IVizSeedDSL['metadata'] = {};
  private specGenerator: SpecGenerator;

  // 构造函数重载：支持直接传入rows或DataSet
  constructor(rows: Record<string, any>[], options?: FieldInferenceOptions);
  constructor(data: IDataSet);
  constructor(
    dataOrRows: IDataSet | Record<string, any>[], 
    options?: FieldInferenceOptions
  ) {
    if (Array.isArray(dataOrRows)) {
      // 直接传入rows数组的情况
      this.data = new DataSet(dataOrRows, options);
    } else {
      // 传入DataSet对象的情况
      this.data = dataOrRows;
    }
    this.specGenerator = new SpecGenerator();
  }

  // 保留静态方法作为替代方式（可选）
  public static fromRows(rows: Record<string, any>[], options?: FieldInferenceOptions): VizSeedBuilder {
    return new VizSeedBuilder(rows, options);
  }

  // 静态方法：从旧版DataField格式创建Builder
  public static fromLegacy(fields: (Dimension | Measure)[], rows: Record<string, any>[]): VizSeedBuilder {
    const dataSet = DataSet.fromLegacy(fields, rows);
    return new VizSeedBuilder(dataSet);
  }

  // 获取数据集信息
  public getDataSet(): IDataSet {
    return this.data;
  }

  // 获取所有可用字段
  public getAvailableFields(): string[] {
    return this.data.fields.map(f => f.name);
  }

  // 获取维度字段
  public getAvailableDimensions(): string[] {
    return this.data.fields.filter(f => f.role === 'dimension').map(f => f.name);
  }

  // 获取指标字段
  public getAvailableMeasures(): string[] {
    return this.data.fields.filter(f => f.role === 'measure').map(f => f.name);
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
    return this.specGenerator.generate(vizSeed, library);
  }

  public getSupportedLibraries(): ChartLibrary[] {
    // 暂时返回可用的库
    return ['vchart', 'vtable', 'echarts'];
  }

  public getSupportedChartTypes(library: ChartLibrary): ChartType[] {
    return CHART_TYPE_LIMITS[library] || [];
  }

  public getAllSupportedChartTypes(): Record<ChartLibrary, ChartType[]> {
    return CHART_TYPE_LIMITS;
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