export type FieldType = 'string' | 'number' | 'date' | 'boolean';

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

export interface DataSet {
  fields: DataField[];
  rows: Record<string, any>[];
}

export interface DataTransformation {
  type: 'pivot' | 'unpivot' | 'aggregate' | 'filter' | 'sort';
  params: Record<string, any>;
}