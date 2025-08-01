import { VizSeedBuilder as IVizSeedBuilder, ChartSpec, NestedMeasure } from '../types';
import { DataSet as IDataSet, FieldInferenceOptions } from '../types/data';
import { ChartType, ChannelMapping, CHART_DATA_REQUIREMENTS, parseChartType } from '../types/charts';
import { VisualStyle } from '../types/visualStyle';
import { createDefaultVisualStyle } from '../config/visualStyleDefaults';
import { DataSet } from '../datasets/DataSet';
import { PipelineContext, FieldMap, FieldSelection } from '../pipeline/PipelineCore';
import { buildSpec, buildVizSeed } from '../pipeline/PipelineRegistry';
import { assign } from 'radash';

export class VizSeedBuilder implements IVizSeedBuilder {
  private dataset: IDataSet;
  private fieldSelection: FieldSelection = {
    dimensions: [],
    measures: [],
    groupMeasure: [],
    rowDimensions: [],
    columnDimensions: []
  };
  private fieldMap: FieldMap = {};
  private data: Record<string, any>[] = []; // 新增data
  private chartType: ChartType = ChartType.BAR;
  private encodes: ChannelMapping[] = [];
  private visualStyle: VisualStyle = createDefaultVisualStyle();
  private theme: 'light' | 'dark' | 'custom' = 'light'; // 默认主题
  private version: string = '1.0.0'; // 默认版本信息
  private vizSeedDSL: any | null = null; // 缓存构建结果
  

  // 构造函数重载：支持直接传入rows或DataSet
  constructor(rows: Record<string, any>[], options?: FieldInferenceOptions);
  constructor(dataset: IDataSet);
  constructor(
    dataOrRows: IDataSet | Record<string, any>[], 
    options?: FieldInferenceOptions
  ) {
    if (Array.isArray(dataOrRows)) {
      // 直接传入rows数组的情况
      this.dataset = new DataSet(dataOrRows, options);
    } else {
      // 传入DataSet对象的情况
      this.dataset = dataOrRows;
    }
    
  }
  
  // 根据字段名从DataSet创建字段定义
  private createFieldDefinition(fieldName: string): any {
    const field = this.dataset.fields.find(f => f.name === fieldName);
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
    const values = this.dataset.rows.map(row => row[fieldName]);
    return [...new Set(values)].slice(0, 10); // 最多10个示例值
  }
  
  // 将字段添加到fieldMap中
  private addFieldToMap(fieldName: string): void {
    if (!this.fieldMap[fieldName]) {
      this.fieldMap[fieldName] = this.createFieldDefinition(fieldName);
    }
  }

  // 静态方法：从VizSeed DSL对象创建Builder
  public static from(vizSeedDSL: any): VizSeedBuilder {
    // 深拷贝整个vizSeedDSL对象
    const clonedDSL = JSON.parse(JSON.stringify(vizSeedDSL));
    
    // 从DSL数据创建Builder实例
    const builder = new VizSeedBuilder(clonedDSL.data || []);
    
    // 直接设置缓存的vizSeedDSL
    builder.vizSeedDSL = clonedDSL;
    
    return builder;
  }

  // 获取数据集信息
  public getDataSet(): IDataSet {
    return this.dataset;
  }

  // 获取所有可用字段（从 DataSet）
  public getAvailableFields(): string[] {
    return this.dataset.fields.map(f => f.name);
  }

  // 获取可用维度字段（从 DataSet）
  public getAvailableDimensions(): string[] {
    return this.dataset.fields.filter(f => f.role === 'dimension').map(f => f.name);
  }

  // 获取可用指标字段（从 DataSet）
  public getAvailableMeasures(): string[] {
    return this.dataset.fields.filter(f => f.role === 'measure').map(f => f.name);
  }
  
  // 获取当前选中的字段（从 fieldMap）
  public getSelectedFields(): string[] {
    return Object.keys(this.fieldMap);
  }

  // 字段选择API - 选择同时自动添加到fieldMap和更新data
  public setDimensions(dimensions: string[]): VizSeedBuilder {
    this.fieldSelection.dimensions = [...dimensions];
    // 将选中的维度字段添加到fieldMap
    dimensions.forEach(dim => this.addFieldToMap(dim));
    // 更新data以包含选定字段的数据
    this.updateDataMap();
    return this;
  }

  public setMeasures(measures: NestedMeasure<string>[]): VizSeedBuilder {
    let flattenedMeasures = measures.flat(5) as string[];
    this.fieldSelection.measures = flattenedMeasures; // 扁平化嵌套的指标数组
    this.fieldSelection.groupMeasure = measures;
    // 将选中的指标字段添加到fieldMap
    flattenedMeasures.forEach(flattenedMeasures => this.addFieldToMap(flattenedMeasures));
    // 更新data以包含选定字段的数据
    this.updateDataMap();
    return this;
  }

  public addDimensionToArray(dimension: string): VizSeedBuilder {
    if (!this.fieldSelection.dimensions.includes(dimension)) {
      this.fieldSelection.dimensions.push(dimension);
      // 添加到fieldMap
      this.addFieldToMap(dimension);
      // 更新data
      this.updateDataMap();
    }
    return this;
  }

  public addMeasureToArray(measure: string): VizSeedBuilder {
    if (!this.fieldSelection.measures.includes(measure)) {
      this.fieldSelection.measures.push(measure);
      // 添加到fieldMap
      this.addFieldToMap(measure);
      // 更新data
      this.updateDataMap();
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
    return this.dataset.fields.map(f => f.name);
  }
  
  // 检查字段是否存在
  public hasField(fieldName: string): boolean {
    return this.dataset.fields.some(f => f.name === fieldName);
  }

  // 更新data以包含选定字段的数据
  private updateDataMap(): void {
    const selectedFields = [...this.fieldSelection.dimensions, ...this.fieldSelection.measures];
    
    // 过滤数据只包含选中的字段
    this.data = this.dataset.rows.map(row => {
      const filteredRow: Record<string, any> = {};
      selectedFields.forEach(field => {
        if (row.hasOwnProperty(field)) {
          filteredRow[field] = row[field];
        }
      });
      return filteredRow;
    });
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
        throw new Error(`不支持的图表类型: '${type}'. 支持的类型: bar, bar_stacked, bar_grouped, bar_percent, column, line, area, scatter, pie, donut, table`);
      }
    } else {
      chartType = type;
    }
    
    if (!CHART_DATA_REQUIREMENTS[chartType]) {
      throw new Error(`不支持的图表类型: ${chartType}`);
    }
    
    this.chartType = chartType;
    return this;
  }

  // 所有视觉通道设置方法已删除 - 现在使用自动通道映射


  public setTitle(title: string): VizSeedBuilder {
    this.visualStyle.title = title;
    return this;
  }

  public setLegend(visible: boolean = true): VizSeedBuilder {
    this.visualStyle.legend.visible = visible;
    return this;
  }

  public setLabel(visible: boolean = true): VizSeedBuilder {
    this.visualStyle.label.visible = visible;
    return this;
  }

  public setTooltip(visible: boolean = true): VizSeedBuilder {
    this.visualStyle.tooltip.visible = visible;
    return this;
  }

  public setStyle(styleOptions: any): VizSeedBuilder {
    // 使用radash的assign进行深度合并，数组会被直接替换而不是合并
    this.visualStyle = assign(this.visualStyle, styleOptions);
    return this;
  }

  public build(): any {
    // 如果已经缓存了结果，直接返回
    if (this.vizSeedDSL) {
      return this.vizSeedDSL;
    }
    
    // 强化前置验证 - 要求用户必须设置足够的字段
    this.validateFieldRequirements();
    
    // 使用简化的Pipeline构建VizSeed对象
    const context: PipelineContext = {
      chartType: this.chartType, // 图表类型
      encodes: this.encodes, // 映射通道配置
      fieldMap: this.fieldMap,
      fieldSelection: this.fieldSelection,
      data: this.data,
      visualStyle: this.visualStyle,
      theme: this.theme,
      version: this.version
    };

    // 构建并缓存结果
    this.vizSeedDSL = buildVizSeed(context.chartType, context);
    return this.vizSeedDSL;
  }

  public buildSpec(): ChartSpec {
    
    try {
      // 确保已构建vizSeedDSL
      if (!this.vizSeedDSL) {
        this.build();
      }
      
      // 直接使用缓存的vizSeedDSL作为规范上下文
      const specContext: PipelineContext = {
        chartType: this.vizSeedDSL.chartType, // 图表类型
        encodes: this.vizSeedDSL.encodes, // 映射通道配置
        fieldMap: this.vizSeedDSL.fieldMap,
        fieldSelection: {
          dimensions: this.vizSeedDSL.dimensions,
          measures: this.vizSeedDSL.measures,
          groupMeasure: this.vizSeedDSL.groupMeasure,
          rowDimensions: this.vizSeedDSL.rowDimensions ,
          columnDimensions: this.vizSeedDSL.columnDimensions
        },
        data: this.vizSeedDSL.data,
        visualStyle: this.vizSeedDSL.style,
        theme: this.vizSeedDSL.theme,
        version: this.vizSeedDSL.version
      };

      // 使用简化的pipeline构建规范
      return buildSpec(specContext.chartType, specContext);
    } catch (error: any) {
      throw new Error(`构建图表规范失败: ${error.message}`);
    }
  }


  private validateFieldRequirements(): void {
    if (!this.chartType) {
      throw new Error('图表类型未设置，请先调用 setChartType()');
    }
    
    const chartType = this.chartType;
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