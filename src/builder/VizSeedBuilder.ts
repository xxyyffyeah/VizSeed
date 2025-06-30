import { VizSeedBuilder as IVizSeedBuilder, VizSeedDSL as IVizSeedDSL } from '../types';
import { ChartSpec, ChartLibrary } from '../types/specs';
import { DataSet as IDataSet, DataTransformation, Dimension, Measure, FieldInferenceOptions } from '../types/data';
import { ChartType, ChartSubType, ChartConfig } from '../types/charts';
import { VizSeedDSL } from '../core/VizSeedDSL';
import { DataSet } from '../core/DataSet';
import { DimensionOperator } from '../operations/DimensionOperator';
import { PipelineRegistry } from '../pipeline/PipelineRegistry';
import { PipelineContext } from '../pipeline/PipelineBuilder';

export class VizSeedBuilder implements IVizSeedBuilder {
  private data: IDataSet;
  private transformations: DataTransformation[] = [];
  private chartConfig: Partial<ChartConfig> = {
    dimensions: [],
    measures: []
  };
  private metadata: IVizSeedDSL['metadata'] & { vizSeedObject?: any } = {};

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
    
    // 使用Pipeline Builder构建VizSeed对象
    const strategy = PipelineRegistry.getStrategy('vizseed-build');
    if (!strategy) {
      throw new Error('VizSeed构建策略未找到');
    }

    const context: PipelineContext = {
      data: this.data,
      chartConfig: this.chartConfig,
      transformations: this.transformations,
      metadata: this.metadata
    };

    const vizSeedObject = strategy.execute(context);
    
    // 创建增强的metadata，包含构建的VizSeed对象
    const enhancedMetadata = {
      ...this.metadata,
      vizSeedObject
    };
    
    return new VizSeedDSL(
      this.data,
      this.chartConfig as ChartConfig,
      this.transformations,
      enhancedMetadata
    );
  }

  public buildSpec(library: ChartLibrary = 'vchart'): ChartSpec {
    // 限制支持的库
    if (library !== 'vchart' && library !== 'vtable') {
      throw new Error(`不支持的图表库: ${library}，仅支持 vchart 和 vtable`);
    }

    this.validateConfig();
    
    // 使用Pipeline Builder构建图表规范
    const chartType = this.chartConfig.type || 'bar';
    
    try {
      const pipelineKey = PipelineRegistry.createKey(library, chartType);
      const strategy = PipelineRegistry.getStrategy(pipelineKey);
      
      if (!strategy) {
        throw new Error(`未找到 ${library}-${chartType} 的构建策略`);
      }

      // 先构建VizSeed对象
      const vizSeedDSL = this.build();
      const vizSeedObject = (vizSeedDSL.metadata as any)?.vizSeedObject;

      const context: PipelineContext = {
        vizSeed: vizSeedObject,
        data: this.data,
        chartConfig: this.chartConfig,
        metadata: this.metadata
      };

      return strategy.execute(context);
    } catch (error: any) {
      throw new Error(`构建图表规范失败: ${error.message}`);
    }
  }

  public getSupportedLibraries(): ('vchart' | 'vtable')[] {
    // 仅支持VChart和VTable
    return ['vchart', 'vtable'];
  }

  public getSupportedChartTypes(library: 'vchart' | 'vtable'): ChartType[] {
    if (library === 'vchart') {
      return ['bar', 'pie'];
    } else if (library === 'vtable') {
      return ['table'];
    }
    return [];
  }

  public getAllSupportedChartTypes(): Record<ChartLibrary, ChartType[]> {
    return {
      vchart: ['bar', 'pie'],
      vtable: ['table'],
      echarts: [] // 不再支持，但保持接口兼容性
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