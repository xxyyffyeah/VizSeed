import { DataSet as IDataSet, FieldMeta, DataField, FieldInferenceOptions, DataSetOptions } from '../types/data';
import { DataProcessor } from '../utils/DataProcessor';

export class DataSet implements IDataSet {
  public fields: FieldMeta[];
  public rows: Record<string, any>[];

  // 构造函数重载
  constructor(rows: Record<string, any>[], options?: FieldInferenceOptions);
  constructor(options: DataSetOptions);
  constructor(
    rowsOrOptions: Record<string, any>[] | DataSetOptions, 
    inferenceOptions?: FieldInferenceOptions
  ) {
    if (Array.isArray(rowsOrOptions)) {
      // 直接传入rows数组的情况
      this.rows = rowsOrOptions;
      this.fields = DataProcessor.inferFields(this.rows, inferenceOptions);
    } else {
      // 传入DataSetOptions对象的情况（向后兼容）
      const options = rowsOrOptions;
      this.rows = options.rows;
      
      if (options.fields) {
        this.fields = options.fields;
      } else {
        // 自动推断字段
        this.fields = DataProcessor.inferFields(this.rows, options.inferenceOptions);
      }
    }
  }

  // 从rows数据自动生成DataSet
  public static fromRows(rows: Record<string, any>[], options?: FieldInferenceOptions): DataSet {
    return new DataSet({ rows, inferenceOptions: options });
  }

  // 从旧版DataField格式转换
  public static fromLegacy(fields: DataField[], rows: Record<string, any>[]): DataSet {
    const fieldMetas = DataProcessor.convertLegacyFields(fields);
    return new DataSet({ fields: fieldMetas, rows });
  }

  // 获取字段的所有唯一值（替代原来的Field.values）
  public getFieldValues(fieldName: string): any[] {
    return DataProcessor.getFieldValues(fieldName, this.rows);
  }

  // 获取字段统计信息
  public getFieldStats(fieldName: string) {
    return DataProcessor.getFieldStats(fieldName, this.rows);
  }

  // 根据字段名获取字段元数据
  public getField(fieldName: string): FieldMeta | undefined {
    return this.fields.find(f => f.name === fieldName);
  }

  // 获取所有维度字段
  public getDimensions(): FieldMeta[] {
    return this.fields.filter(f => f.role === 'dimension');
  }

  // 获取所有指标字段
  public getMeasures(): FieldMeta[] {
    return this.fields.filter(f => f.role === 'measure');
  }

  // 克隆数据集
  public clone(): DataSet {
    return new DataSet({
      fields: JSON.parse(JSON.stringify(this.fields)),
      rows: JSON.parse(JSON.stringify(this.rows))
    });
  }

  // 添加新字段
  public addField(field: FieldMeta): void {
    this.fields.push(field);
  }

  // 移除字段
  public removeField(fieldName: string): void {
    this.fields = this.fields.filter(f => f.name !== fieldName);
  }

  // 转换为旧版格式（向后兼容）
  public toLegacyFormat(): { fields: DataField[], rows: Record<string, any>[] } {
    const legacyFields: DataField[] = this.fields.map(field => ({
      name: field.name,
      type: field.type,
      role: field.role,
      values: this.getFieldValues(field.name),
      ...(field.role === 'measure' && { aggregation: field.aggregation }),
      ...(field.role === 'dimension' && { isDiscrete: field.isDiscrete })
    } as DataField));

    return {
      fields: legacyFields,
      rows: this.rows
    };
  }
}