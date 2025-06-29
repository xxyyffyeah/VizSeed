export type FieldType = 'string' | 'number' | 'date' | 'boolean';

// 字段元数据接口 - 不包含实际数据值
export interface FieldMeta {
  name: string;
  type: FieldType;
  role: 'dimension' | 'measure';
  nullable?: boolean;
  unique?: boolean;
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'none';
  isDiscrete?: boolean; // 仅用于dimension
}

// 为向后兼容保留的接口
export interface Field {
  name: string;
  type: FieldType;
  values: Array<string | number | Date | boolean>;
}

export interface Dimension extends Field {
  role: 'dimension';
  isDiscrete?: boolean;
}

export interface Measure extends Field {
  role: 'measure';
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'none';
}

export type DataField = Dimension | Measure;

// 字段推断配置
export interface FieldInferenceOptions {
  // 数值型字段的角色推断规则
  numericRoleHint?: (fieldName: string, values: number[]) => 'dimension' | 'measure';
  // 自定义类型推断规则
  typeHint?: (fieldName: string, values: any[]) => FieldType | undefined;
  // 是否自动转换日期字符串
  autoConvertDates?: boolean;
  // 默认聚合函数
  defaultAggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'none';
}

// 新的DataSet接口
export interface DataSet {
  fields: FieldMeta[];
  rows: Record<string, any>[];
  
  // 实例方法
  getFieldValues(fieldName: string): any[];
  getFieldStats(fieldName: string): FieldStats;
  getField(fieldName: string): FieldMeta | undefined;
  getDimensions(): FieldMeta[];
  getMeasures(): FieldMeta[];
  clone(): DataSet;
  addField(field: FieldMeta): void;
  removeField(fieldName: string): void;
}

// DataSet构造选项
export interface DataSetOptions {
  fields?: FieldMeta[];
  rows: Record<string, any>[];
  inferenceOptions?: FieldInferenceOptions;
}

// DataSet类的接口
export interface DataSetStatic {
  new(rows: Record<string, any>[], options?: FieldInferenceOptions): DataSet;
  new(options: DataSetOptions): DataSet;
  fromRows(rows: Record<string, any>[], options?: FieldInferenceOptions): DataSet;
  fromLegacy(fields: DataField[], rows: Record<string, any>[]): DataSet;
}

export interface DataTransformation {
  type: 'pivot' | 'unpivot' | 'aggregate' | 'filter' | 'sort';
  params: Record<string, any>;
}

// 字段统计信息
export interface FieldStats {
  count: number;
  nullCount: number;
  uniqueCount: number;
  min?: any;
  max?: any;
  mean?: number; // 仅数值字段
  median?: number; // 仅数值字段
}