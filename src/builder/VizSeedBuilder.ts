import { VizSeedBuilder as IVizSeedBuilder, ChartSpec } from '../types';
import { DataSet as IDataSet, DataTransformation, Dimension, Measure, FieldInferenceOptions } from '../types/data';
import { ChartType, ChartConfig, ChannelMapping, CHART_REQUIREMENTS } from '../types/charts';
// VizSeedDSL类已不再使用，改为函数式pipeline构建
import { DataSet } from '../core/DataSet';
import { DimensionOperator } from '../operations/DimensionOperator';
import { PipelineContext } from '../pipeline/PipelineCore';
import { buildSpec, buildVizSeed } from '../pipeline/PipelineRegistry';

export class VizSeedBuilder implements IVizSeedBuilder {
  private data: IDataSet;
  private transformations: DataTransformation[] = [];
  private chartConfig: Partial<ChartConfig> = {
    mapping: {}
  };
  private visualStyle: {
    title?: string;
    description?: string;
    legend?: boolean;
    label?: boolean;
    tooltip?: boolean;
    vizSeedObject?: any;
  } = {
    legend: true,
    label: true,
    tooltip: true
  };

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

  // 静态方法：从VizSeed对象创建Builder
  public static from(vizSeed: any): VizSeedBuilder {
    const builder = new VizSeedBuilder(vizSeed.data);
    builder.chartConfig = { ...vizSeed.chartConfig };
    builder.transformations = [...vizSeed.transformations];
    builder.visualStyle = { ...vizSeed.visualStyle };
    return builder;
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

  public setChartType(type: ChartType): VizSeedBuilder {
    this.chartConfig.type = type;
    return this;
  }

  // 通用通道设置方法
  public setChannel(channel: string, field: string): VizSeedBuilder {
    if (!this.chartConfig.mapping) {
      this.chartConfig.mapping = {};
    }
    (this.chartConfig.mapping as any)[channel] = field;
    return this;
  }

  // 便捷方法 - 通用通道
  public setXField(field: string): VizSeedBuilder {
    return this.setChannel('x', field);
  }

  public setYField(field: string): VizSeedBuilder {
    return this.setChannel('y', field);
  }

  public setColorField(field: string): VizSeedBuilder {
    return this.setChannel('color', field);
  }

  // 饼图专用方法
  public setCategoryField(field: string): VizSeedBuilder {
    return this.setChannel('category', field);
  }

  public setValueField(field: string): VizSeedBuilder {
    return this.setChannel('value', field);
  }

  // 表格专用方法
  public setRowDimension(field: string): VizSeedBuilder {
    return this.setChannel('rowDimension', field);
  }

  public setColumnDimension(field: string): VizSeedBuilder {
    return this.setChannel('columnDimension', field);
  }

  public setMeasureField(field: string): VizSeedBuilder {
    return this.setChannel('measure', field);
  }

  // 向后兼容方法（已废弃）
  /** @deprecated 使用setXField或setYField替代 */
  public addDimension(field: string): VizSeedBuilder {
    console.warn('addDimension已废弃，请使用setXField或setYField');
    return this.setXField(field);
  }

  /** @deprecated 使用setValueField或setYField替代 */
  public addMeasure(field: string, _aggregation?: string): VizSeedBuilder {
    console.warn('addMeasure已废弃，请使用setValueField或setYField');
    return this.setValueField(field);
  }

  /** @deprecated 使用setColorField替代 */
  public setColor(field: string): VizSeedBuilder {
    console.warn('setColor已废弃，请使用setColorField');
    return this.setColorField(field);
  }

  /** @deprecated 不再支持size字段 */
  public setSizeField(_field: string): VizSeedBuilder {
    console.warn('setSizeField已废弃');
    return this;
  }

  public setTitle(title: string): VizSeedBuilder {
    if (!this.visualStyle) this.visualStyle = {};
    this.visualStyle.title = title;
    return this;
  }

  public setLegend(visible: boolean = true): VizSeedBuilder {
    if (!this.visualStyle) this.visualStyle = {};
    this.visualStyle.legend = visible;
    return this;
  }

  public setLabel(visible: boolean = true): VizSeedBuilder {
    if (!this.visualStyle) this.visualStyle = {};
    this.visualStyle.label = visible;
    return this;
  }

  public setTooltip(visible: boolean = true): VizSeedBuilder {
    if (!this.visualStyle) this.visualStyle = {};
    this.visualStyle.tooltip = visible;
    return this;
  }

  public build(): any {
    this.validateConfig();
    
    // 使用函数式Pipeline构建VizSeed对象
    const context: PipelineContext = {
      data: this.data,
      chartConfig: this.chartConfig,
      transformations: this.transformations,
      visualStyle: this.visualStyle
    };

    // 直接返回pipeline构建的VizSeed对象
    return buildVizSeed(context);
  }

  public buildSpec(): ChartSpec {
    this.validateConfig();
    
    // 根据图表类型自动选择图表库
    const chartType = this.chartConfig.type || 'bar';
    const library = this.selectLibrary(chartType);
    
    try {
      // 直接使用Builder的数据构建规范上下文
      const specContext: PipelineContext = {
        data: this.data,
        chartConfig: this.chartConfig,
        transformations: this.transformations,
        visualStyle: this.visualStyle
      };

      // 使用简化的pipeline构建规范
      return buildSpec(chartType, library, specContext);
    } catch (error: any) {
      throw new Error(`构建图表规范失败: ${error.message}`);
    }
  }

  private selectLibrary(chartType: ChartType): 'vchart' | 'vtable' {
    // 表格类型使用VTable
    if (chartType === 'table') {
      return 'vtable';
    }
    // 其他类型使用VChart
    return 'vchart';
  }

  private validateConfig(): void {
    if (!this.chartConfig.type) {
      throw new Error('图表类型未设置');
    }
    
    const mapping = this.chartConfig.mapping || {};
    const chartType = this.chartConfig.type;
    
    // 获取图表类型要求
    const requirement = CHART_REQUIREMENTS[chartType];
    if (!requirement) {
      throw new Error(`不支持的图表类型: ${chartType}`);
    }
    
    // 检查必需字段
    for (const requiredChannel of requirement.required) {
      if (!mapping[requiredChannel as keyof ChannelMapping]) {
        throw new Error(`图表类型 ${chartType} 缺少必需的通道: ${requiredChannel}`);
      }
    }
    
    // 自定义验证
    if (requirement.validation && !requirement.validation(mapping)) {
      throw new Error(`图表类型 ${chartType} 的通道配置验证失败`);
    }
    
    // 检查最少字段数
    const setChannels = Object.values(mapping).filter(v => v).length;
    if (setChannels < requirement.minFields) {
      throw new Error(`图表类型 ${chartType} 至少需要 ${requirement.minFields} 个字段，当前只有 ${setChannels} 个`);
    }
  }
}