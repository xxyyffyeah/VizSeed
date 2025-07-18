import { VizSeedBuilder as IVizSeedBuilder, ChartSpec, NestedMeasure } from '../types';
import { DataSet as IDataSet, FieldInferenceOptions } from '../types/data';
import { ChartType, ChannelMapping, CHART_DATA_REQUIREMENTS, parseChartType } from '../types/charts';
// VizSeedDSL类已不再使用，改为函数式pipeline构建
import { DataSet } from '../datasets/DataSet';
import { PipelineContext, FieldMap, FieldSelection } from '../pipeline/PipelineCore';
import { buildSpec, buildVizSeed } from '../pipeline/PipelineRegistry';

export class VizSeedBuilder implements IVizSeedBuilder {
  private dataset: IDataSet;
  private fieldSelection: FieldSelection = {
    dimensions: [],
    measures: [],
    groupMeasure: []
    // 新增groupMeasure字段，如需添加请确保类型定义中有 groupMeasure: string[] 或类似声明
  };
  private fieldMap: FieldMap = {};
  private data: Record<string, any>[] = []; // 新增data
  private chartType: ChartType = ChartType.BAR;
  private encodes: ChannelMapping[] = [];
  private visualStyle = {
    title: '',
    color: {
      colors: [] as Array<{id: string, name: string, value: string}>
    },
    legend: {
      enable: true,
      position: '',
    },
    label: {
      enable: true,
    },
    tooltip: {
      enable: true,
    },
    animation: {
      enable: true,
    },
    responsive: {
      widthMode: 'standard' as 'standard' | 'adaptive',
      heightMode: 'adaptive' as 'standard' | 'adaptive',
    },
    yAxis: {},
    xAxis: {},
    columnStack: {
      stackRadius: 5,
    },
    pie: {},
    pivotPie: {},
    doughnut: {},
    line: {
      lineStyle: {},
    }
  };
  private theme: 'light' | 'dark' | 'custom' = 'light'; // 默认主题
  private version: string = '0.1.0'; // 默认版本信息
  

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

  // 静态方法：从VizSeed对象创建Builder
  public static from(vizSeed: any): VizSeedBuilder {
    // 深拷贝整个vizSeed对象
    const clonedVizSeed = JSON.parse(JSON.stringify(vizSeed));
    
    const builder = new VizSeedBuilder(clonedVizSeed.data);
    builder.chartType = clonedVizSeed.chartType;
    builder.data = clonedVizSeed.data;
    builder.fieldMap = clonedVizSeed.fieldMap;
    builder.fieldSelection = clonedVizSeed.fieldSelection;
    builder.visualStyle = clonedVizSeed.visualStyle;
    builder.theme = clonedVizSeed.theme;
    builder.version = clonedVizSeed.version;
    
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
        throw new Error(`不支持的图表类型: '${type}'. 支持的类型: bar, column, line, area, scatter, pie, donut, table`);
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
    this.visualStyle.legend.enable = visible;
    return this;
  }

  public setLabel(visible: boolean = true): VizSeedBuilder {
    this.visualStyle.label.enable = visible;
    return this;
  }

  public setTooltip(visible: boolean = true): VizSeedBuilder {
    this.visualStyle.tooltip.enable = visible;
    return this;
  }

  public setStyle(styleOptions: any): VizSeedBuilder {
    // 简单的对象合并，支持嵌套属性更新
    Object.keys(styleOptions).forEach(key => {
      if (typeof styleOptions[key] === 'object' && styleOptions[key] !== null && !Array.isArray(styleOptions[key])) {
        // 对象类型：合并嵌套属性
        (this.visualStyle as any)[key] = { ...(this.visualStyle as any)[key], ...styleOptions[key] };
      } else {
        // 基础类型或数组：直接覆盖
        (this.visualStyle as any)[key] = styleOptions[key];
      }
    });
    return this;
  }

  public async build(): Promise<any> {
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

    return await buildVizSeed(context.chartType, context);
  }

  public async buildSpec(): Promise<ChartSpec> {
    // 先验证字段要求
    this.validateFieldRequirements();
    
    
    try {
      // 先构建VizSeed以获得自动通道映射
      const vizSeed = await this.build();
      
      // 使用构建后的VizSeed数据构建规范上下文
      const specContext: PipelineContext = {
        chartType: vizSeed.chartType, // 图表类型
        encodes: vizSeed.encodes, // 映射通道配置
        fieldMap: vizSeed.fieldMap,
        fieldSelection: this.fieldSelection,
        data: vizSeed.data,
        visualStyle: vizSeed.visualStyle,
        theme: vizSeed.theme,
        version: vizSeed.version
      };

      // 使用简化的pipeline构建规范
      return await buildSpec(specContext.chartType, specContext);
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