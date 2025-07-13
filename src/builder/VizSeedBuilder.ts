import { VizSeedBuilder as IVizSeedBuilder, ChartSpec, NestedMeasure } from '../types';
import { DataSet as IDataSet, FieldInferenceOptions } from '../types/data';
import { ChartType, ChartConfig, CHART_DATA_REQUIREMENTS, parseChartType } from '../types/charts';
// VizSeedDSL类已不再使用，改为函数式pipeline构建
import { DataSet } from '../datasets/DataSet';
import { PipelineContext, FieldMap, FieldSelection } from '../pipeline/PipelineCore';
import { buildSpec, buildVizSeed } from '../pipeline/PipelineRegistry';

export class VizSeedBuilder implements IVizSeedBuilder {
  private data: IDataSet;
  private fieldSelection: FieldSelection = {
    dimensions: [],
    measures: [],
    groupMeasure: []
    // 新增groupMeasure字段，如需添加请确保类型定义中有 groupMeasure: string[] 或类似声明
  };
  private fieldMap: FieldMap = {};
  private dataMap: Record<string, any>[] = []; // 新增dataMap
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
  
  // 根据字段名从DataSet创建字段定义
  private createFieldDefinition(fieldName: string): any {
    const field = this.data.fields.find(f => f.name === fieldName);
    if (!field) {
      throw new Error(`字段 ${fieldName} 不存在于数据集中`);
    }
    
    return {
      id: field.name,
      type: field.type,
      alias: field.name, // 默认使用字段名作为别名
      location: field.role,
      domain: this.extractFieldDomain(field.name),
      format: {}
    };
  }
  
  // 提取字段的域值
  private extractFieldDomain(fieldName: string): any[] {
    const values = this.data.rows.map(row => row[fieldName]);
    return [...new Set(values)].slice(0, 10); // 最多10个示例值
  }
  
  // 将字段添加到fieldMap中
  private addFieldToMap(fieldName: string): void {
    if (!this.fieldMap[fieldName]) {
      this.fieldMap[fieldName] = this.createFieldDefinition(fieldName);
    }
  }

  // 保留静态方法作为替代方式（可选）
  public static fromRows(rows: Record<string, any>[], options?: FieldInferenceOptions): VizSeedBuilder {
    return new VizSeedBuilder(rows, options);
  }


  // 静态方法：从VizSeed对象创建Builder
  public static from(vizSeed: any): VizSeedBuilder {
    const builder = new VizSeedBuilder(vizSeed.data);
    builder.chartConfig = { ...vizSeed.chartConfig };
    
    // 恢复 fieldMap
    if (vizSeed.fieldMap) {
      builder.fieldMap = { ...vizSeed.fieldMap };
    }
    
    // 恢复 fieldSelection
    if (vizSeed.fieldSelection) {
      builder.fieldSelection = { ...vizSeed.fieldSelection };
    }
    
    builder.visualStyle = { ...vizSeed.visualStyle };
    return builder;
  }

  // 获取数据集信息
  public getDataSet(): IDataSet {
    return this.data;
  }

  // 获取所有可用字段（从 DataSet）
  public getAvailableFields(): string[] {
    return this.data.fields.map(f => f.name);
  }

  // 获取可用维度字段（从 DataSet）
  public getAvailableDimensions(): string[] {
    return this.data.fields.filter(f => f.role === 'dimension').map(f => f.name);
  }

  // 获取可用指标字段（从 DataSet）
  public getAvailableMeasures(): string[] {
    return this.data.fields.filter(f => f.role === 'measure').map(f => f.name);
  }
  
  // 获取当前选中的字段（从 fieldMap）
  public getSelectedFields(): string[] {
    return Object.keys(this.fieldMap);
  }

  // 字段选择API - 选择同时自动添加到fieldMap
  public setDimensions(dimensions: string[]): VizSeedBuilder {
    this.fieldSelection.dimensions = [...dimensions];
    // 将选中的维度字段添加到fieldMap
    dimensions.forEach(dim => this.addFieldToMap(dim));
    return this;
  }

  public setMeasures(measures: NestedMeasure<string>[]): VizSeedBuilder {
    let flattenedMeasures = measures.flat(5) as string[];
    this.fieldSelection.measures = flattenedMeasures; // 扁平化嵌套的指标数组
    this.fieldSelection.groupMeasure = measures;
    // 将选中的指标字段添加到fieldMap
    flattenedMeasures.forEach(flattenedMeasures => this.addFieldToMap(flattenedMeasures));
    return this;
  }

  public addDimensionToArray(dimension: string): VizSeedBuilder {
    if (!this.fieldSelection.dimensions.includes(dimension)) {
      this.fieldSelection.dimensions.push(dimension);
      // 添加到fieldMap
      this.addFieldToMap(dimension);
    }
    return this;
  }

  public addMeasureToArray(measure: string): VizSeedBuilder {
    if (!this.fieldSelection.measures.includes(measure)) {
      this.fieldSelection.measures.push(measure);
      // 添加到fieldMap
      this.addFieldToMap(measure);
    }
    return this;
  }

  public getDimensions(): string[] {
    return [...this.fieldSelection.dimensions];
  }

  public getMeasures(): string[] {
    return [...this.fieldSelection.measures];
  }

  // FieldMap相关API
  public getFieldMap(): FieldMap {
    return { ...this.fieldMap };
  }

  public setFieldMap(fieldMap: FieldMap): VizSeedBuilder {
    this.fieldMap = { ...fieldMap };
    return this;
  }
  
  public getFieldSelection(): FieldSelection {
    return { ...this.fieldSelection };
  }

  public setFieldSelection(fieldSelection: FieldSelection): VizSeedBuilder {
    this.fieldSelection = { ...fieldSelection };
    return this;
  }
  
  // 更新字段别名
  public setFieldAlias(fieldId: string, alias: string): VizSeedBuilder {
    const field = this.fieldMap[fieldId];
    if (field) {
      field.alias = alias;
    } else if (this.hasField(fieldId)) {
      // 如果字段存在于DataSet但不在fieldMap中，先添加再设置别名
      this.addFieldToMap(fieldId);
      const newField = this.fieldMap[fieldId];
      if (newField) {
        newField.alias = alias;
      }
    } else {
      throw new Error(`字段 ${fieldId} 不存在于数据集中`);
    }
    return this;
  }
  
  // 获取所有可用字段名称（从 DataSet）
  public getAvailableFieldNames(): string[] {
    return this.data.fields.map(f => f.name);
  }
  
  // 检查字段是否存在
  public hasField(fieldName: string): boolean {
    return this.data.fields.some(f => f.name === fieldName);
  }



  // 重载：支持字符串和枚举两种输入方式
  public setChartType(type: string): VizSeedBuilder;
  public setChartType(type: ChartType): VizSeedBuilder;
  public setChartType(type: string | ChartType): VizSeedBuilder {
    let chartType: ChartType;
    
    if (typeof type === 'string') {
      // 使用Zod转换字符串为枚举
      try {
        chartType = parseChartType(type);
      } catch (error) {
        throw new Error(`不支持的图表类型: '${type}'. 支持的类型: bar, column, line, area, scatter, pie, donut, table`);
      }
    } else {
      chartType = type;
    }
    
    if (!CHART_DATA_REQUIREMENTS[chartType]) {
      throw new Error(`不支持的图表类型: ${chartType}`);
    }
    
    this.chartConfig.type = chartType;
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
    // 强化前置验证 - 要求用户必须设置足够的字段
    this.validateFieldRequirements();
    
    // 使用简化的Pipeline构建VizSeed对象
    const context: PipelineContext = {
      data: this.data,
      chartConfig: this.chartConfig,
      fieldMap: this.fieldMap,
      fieldSelection: this.fieldSelection,
      dataMap: this.dataMap,
      visualStyle: this.visualStyle
    };

    // 使用图表类型选择对应的VizSeed pipeline
    const chartType = this.chartConfig.type || ChartType.BAR;
    return buildVizSeed(chartType, context);
  }

  public buildSpec(): ChartSpec {
    // 先验证字段要求
    this.validateFieldRequirements();
    
    // 根据图表类型自动选择图表库
    const chartType = this.chartConfig.type || ChartType.BAR;
    
    try {
      // 先构建VizSeed以获得自动通道映射
      const vizSeed = this.build();
      
      // 使用构建后的VizSeed数据构建规范上下文
      const specContext: PipelineContext = {
        data: this.data,
        chartConfig: vizSeed.chartConfig, // 使用经过自动映射的配置
        fieldMap: vizSeed.fieldMap,
        fieldSelection: vizSeed.currentFieldSelection || this.fieldSelection,
        dataMap: vizSeed.dataMap,
        visualStyle: this.visualStyle
      };

      // 使用简化的pipeline构建规范
      return buildSpec(chartType, specContext);
    } catch (error: any) {
      throw new Error(`构建图表规范失败: ${error.message}`);
    }
  }


  private validateFieldRequirements(): void {
    if (!this.chartConfig.type) {
      throw new Error('图表类型未设置，请先调用 setChartType()');
    }
    
    const chartType = this.chartConfig.type;
    const { dimensions, measures } = this.fieldSelection;
    const totalFields = dimensions.length + measures.length;
    
    // 检查用户是否设置了字段
    if (totalFields === 0) {
      throw new Error(`请先设置字段，调用 setDimensions() 和 setMeasures() 方法`);
    }
    
    // 检查指标数量：如果指标为0且不是特殊图表类型，则抛出错误
    if (measures.length === 0) {
      const allowedTypesWithoutMeasures = ['wordcloud', 'listtable', 'pivottable'];
      if (!allowedTypesWithoutMeasures.includes(chartType)) {
        throw new Error(`${chartType}图表需要添加相应的指标字段，请调用 setMeasures() 或 addMeasureToArray() 方法添加指标`);
      }
    }
    

  }

}