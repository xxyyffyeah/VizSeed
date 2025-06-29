import { DataSet as IDataSet, DataTransformation, DataField, FieldMeta, FieldType, FieldInferenceOptions, FieldStats } from '../types/data';
import { DataSet } from '../core/DataSet';

export class DataProcessor {
  
  // 智能字段推断方法
  public static inferFields(rows: Record<string, any>[], options?: FieldInferenceOptions): FieldMeta[] {
    if (!rows || rows.length === 0) {
      return [];
    }

    const fieldNames = Object.keys(rows[0]);
    const fields: FieldMeta[] = [];

    for (const fieldName of fieldNames) {
      const values = rows.map(row => row[fieldName]).filter(v => v != null);
      if (values.length === 0) continue;

      const fieldMeta = this.inferSingleField(fieldName, values, options);
      fields.push(fieldMeta);
    }

    return fields;
  }

  private static inferSingleField(fieldName: string, values: any[], options?: FieldInferenceOptions): FieldMeta {
    // 自定义类型推断
    if (options?.typeHint) {
      const customType = options.typeHint(fieldName, values);
      if (customType) {
        return this.createFieldMeta(fieldName, customType, values, options);
      }
    }

    // 自动类型推断
    const inferredType = this.inferFieldType(values, options?.autoConvertDates);
    return this.createFieldMeta(fieldName, inferredType, values, options);
  }

  private static inferFieldType(values: any[], autoConvertDates = true): FieldType {
    const sample = values.slice(0, Math.min(100, values.length)); // 采样前100个值
    
    // 检查是否为数值类型
    const numericCount = sample.filter(v => typeof v === 'number' && !isNaN(v)).length;
    if (numericCount / sample.length > 0.8) {
      return 'number';
    }

    // 检查是否为布尔类型
    const booleanCount = sample.filter(v => typeof v === 'boolean').length;
    if (booleanCount / sample.length > 0.8) {
      return 'boolean';
    }

    // 检查是否为日期类型
    if (autoConvertDates) {
      const dateCount = sample.filter(v => this.isDateLike(v)).length;
      if (dateCount / sample.length > 0.8) {
        return 'date';
      }
    }

    // 默认为字符串类型
    return 'string';
  }

  private static isDateLike(value: any): boolean {
    if (value instanceof Date) return true;
    if (typeof value !== 'string') return false;
    
    // 常见日期格式正则
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // 2024-01-01
      /^\d{4}\/\d{2}\/\d{2}$/, // 2024/01/01
      /^\d{2}\/\d{2}\/\d{4}$/, // 01/01/2024
      /^\d{4}-\d{2}$/, // 2024-01
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO format
    ];
    
    return datePatterns.some(pattern => pattern.test(value)) && !isNaN(Date.parse(value));
  }

  private static createFieldMeta(fieldName: string, type: FieldType, values: any[], options?: FieldInferenceOptions): FieldMeta {
    const stats = this.calculateFieldStats(values);
    
    let role: 'dimension' | 'measure';
    
    if (type === 'number') {
      // 数值类型的角色推断
      if (options?.numericRoleHint) {
        role = options.numericRoleHint(fieldName, values as number[]);
      } else {
        // 默认推断规则
        role = this.inferNumericRole(fieldName, values as number[], stats);
      }
    } else {
      role = 'dimension';
    }

    return {
      name: fieldName,
      type,
      role,
      nullable: stats.nullCount > 0,
      unique: stats.uniqueCount === stats.count,
      aggregation: role === 'measure' ? (options?.defaultAggregation || 'sum') : undefined,
      isDiscrete: role === 'dimension'
    };
  }

  private static inferNumericRole(fieldName: string, values: number[], stats: FieldStats): 'dimension' | 'measure' {
    const fieldLower = fieldName.toLowerCase();
    
    // 基于字段名的启发式规则
    const dimensionKeywords = ['id', 'year', 'month', 'day', 'code', 'number', 'rank', 'level', 'grade'];
    const measureKeywords = ['amount', 'count', 'sum', 'total', 'avg', 'mean', 'price', 'cost', 'value', 'score', 'rate', 'percent', 'sales', 'profit', 'revenue'];
    
    if (dimensionKeywords.some(keyword => fieldLower.includes(keyword))) {
      return 'dimension';
    }
    
    if (measureKeywords.some(keyword => fieldLower.includes(keyword))) {
      return 'measure';
    }
    
    // 基于数据特征的推断
    const uniqueRatio = stats.uniqueCount / stats.count;
    
    // 如果唯一值比例很高，可能是维度（如ID、编码等）
    if (uniqueRatio > 0.9) {
      return 'dimension';
    }
    
    // 如果唯一值很少，但是数值范围小，可能是维度（如等级、评分等）
    if (uniqueRatio < 0.1 && stats.max && stats.min && (stats.max - stats.min) < 10) {
      return 'dimension';
    }
    
    // 对于常见的业务数值（销售额、利润等），默认为指标
    return 'measure';
  }

  private static calculateFieldStats(values: any[]): FieldStats {
    const nonNullValues = values.filter(v => v != null);
    const uniqueValues = new Set(nonNullValues);
    
    const stats: FieldStats = {
      count: values.length,
      nullCount: values.length - nonNullValues.length,
      uniqueCount: uniqueValues.size
    };
    
    if (nonNullValues.length > 0) {
      // 数值类型的统计
      const numericValues = nonNullValues.filter(v => typeof v === 'number' && !isNaN(v));
      if (numericValues.length === nonNullValues.length) {
        stats.min = Math.min(...numericValues);
        stats.max = Math.max(...numericValues);
        stats.mean = numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length;
        
        const sorted = [...numericValues].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        stats.median = sorted.length % 2 === 0 
          ? (sorted[mid - 1] + sorted[mid]) / 2 
          : sorted[mid];
      } else {
        // 非数值类型的最小值和最大值
        const sortedValues = [...nonNullValues].sort();
        stats.min = sortedValues[0];
        stats.max = sortedValues[sortedValues.length - 1];
      }
    }
    
    return stats;
  }
  public static applyTransformations(data: IDataSet, transformations: DataTransformation[]): IDataSet {
    let result = this.cloneDataSet(data);

    for (const transformation of transformations) {
      result = this.applyTransformation(result, transformation);
    }

    return result;
  }

  private static applyTransformation(data: IDataSet, transformation: DataTransformation): IDataSet {
    switch (transformation.type) {
      case 'pivot':
        return this.pivot(data, transformation.params);
      case 'unpivot':
        return this.unpivot(data, transformation.params);
      case 'aggregate':
        return this.aggregate(data, transformation.params);
      case 'filter':
        return this.filter(data, transformation.params);
      case 'sort':
        return this.sort(data, transformation.params);
      default:
        return data;
    }
  }

  private static pivot(data: IDataSet, params: any): IDataSet {
    const { sourceField, targetField, valueField, groupBy } = params;
    
    if (params.operation === 'elevate') {
      return this.elevateField(data, sourceField, targetField, valueField);
    } else if (params.operation === 'group_elevate') {
      return this.groupElevateField(data, sourceField, groupBy);
    }
    
    return data;
  }

  private static unpivot(data: IDataSet, params: any): IDataSet {
    const { sourceField, targetField, keyField, sourceFields } = params;
    
    if (params.operation === 'reduce') {
      return this.reduceField(data, sourceField, targetField, keyField);
    } else if (params.operation === 'group_reduce') {
      return this.groupReduceFields(data, sourceFields, targetField, keyField);
    }
    
    return data;
  }

  private static elevateField(data: IDataSet, sourceField: string, targetField: string, valueField: string): IDataSet {
    const uniqueValues = [...new Set(data.rows.map(row => row[sourceField]))];
    
    const newFields: FieldMeta[] = data.fields.filter(f => f.name !== sourceField);
    // TODO: 适配FieldMeta格式
    newFields.push({
      name: targetField,
      type: 'string',
      role: 'dimension'
    } as any);
    newFields.push({
      name: valueField,
      type: 'number',
      role: 'measure'
    } as any);

    const newRows = data.rows.map(row => {
      const newRow = { ...row };
      delete newRow[sourceField];
      newRow[targetField] = row[sourceField];
      newRow[valueField] = 1;
      return newRow;
    });

    return new DataSet({
      fields: newFields,
      rows: newRows
    });
  }

  private static reduceField(data: IDataSet, sourceField: string, targetField: string, keyField: string): IDataSet {
    const newFields: FieldMeta[] = data.fields.filter(f => f.name !== sourceField);
    // TODO: 适配FieldMeta格式
    newFields.push({
      name: keyField,
      type: 'string',
      role: 'dimension'
    } as any);
    newFields.push({
      name: targetField,
      type: 'number',
      role: 'measure'
    } as any);

    const newRows = data.rows.map(row => {
      const newRow = { ...row };
      const value = newRow[sourceField];
      delete newRow[sourceField];
      newRow[keyField] = sourceField;
      newRow[targetField] = value;
      return newRow;
    });

    return new DataSet({
      fields: newFields,
      rows: newRows
    });
  }

  private static groupElevateField(data: IDataSet, sourceField: string, groupBy: string[]): IDataSet {
    return data;
  }

  private static groupReduceFields(data: IDataSet, sourceFields: string[], targetField: string, keyField: string): IDataSet {
    const otherFields = data.fields.filter(f => !sourceFields.includes(f.name));
    const newFields: FieldMeta[] = [...otherFields];
    
    // TODO: 适配FieldMeta格式
    newFields.push({
      name: keyField,
      type: 'string',
      role: 'dimension'
    } as any);
    newFields.push({
      name: targetField,
      type: 'number',
      role: 'measure'
    } as any);

    const newRows: any[] = [];
    
    data.rows.forEach(row => {
      sourceFields.forEach(field => {
        const newRow: any = {};
        
        otherFields.forEach(f => {
          newRow[f.name] = row[f.name];
        });
        
        newRow[keyField] = field;
        newRow[targetField] = row[field];
        
        newRows.push(newRow);
      });
    });

    return new DataSet({
      fields: newFields,
      rows: newRows
    });
  }

  private static aggregate(data: IDataSet, params: any): IDataSet {
    return data;
  }

  private static filter(data: IDataSet, params: any): IDataSet {
    const { field, operator, value } = params;
    
    const filteredRows = data.rows.filter(row => {
      const fieldValue = row[field];
      
      switch (operator) {
        case '=':
        case '==':
          return fieldValue === value;
        case '!=':
          return fieldValue !== value;
        case '>':
          return fieldValue > value;
        case '>=':
          return fieldValue >= value;
        case '<':
          return fieldValue < value;
        case '<=':
          return fieldValue <= value;
        case 'contains':
          return String(fieldValue).includes(String(value));
        default:
          return true;
      }
    });

    return new DataSet({
      fields: data.fields,
      rows: filteredRows
    });
  }

  private static sort(data: IDataSet, params: any): IDataSet {
    const { field, direction } = params;
    
    const sortedRows = [...data.rows].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (direction === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return new DataSet({
      fields: data.fields,
      rows: sortedRows
    });
  }

  private static cloneDataSet(data: IDataSet): IDataSet {
    return JSON.parse(JSON.stringify(data));
  }

  // 从旧版DataField转换为FieldMeta
  public static convertLegacyFields(fields: DataField[]): FieldMeta[] {
    return fields.map(field => ({
      name: field.name,
      type: field.type,
      role: field.role,
      nullable: field.values.some(v => v == null),
      unique: new Set(field.values).size === field.values.length,
      aggregation: field.role === 'measure' ? (field as any).aggregation || 'sum' : undefined,
      isDiscrete: field.role === 'dimension' ? (field as any).isDiscrete !== false : undefined
    }));
  }

  // 获取字段的所有唯一值（用于替代原来的values数组）
  public static getFieldValues(fieldName: string, rows: Record<string, any>[]): any[] {
    return [...new Set(rows.map(row => row[fieldName]).filter(v => v != null))];
  }

  // 获取字段的统计信息
  public static getFieldStats(fieldName: string, rows: Record<string, any>[]): FieldStats {
    const values = rows.map(row => row[fieldName]);
    return this.calculateFieldStats(values);
  }
}