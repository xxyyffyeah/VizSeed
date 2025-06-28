import { DataSet, DataTransformation, DataField } from '../types/data';

export class DataProcessor {
  public static applyTransformations(data: DataSet, transformations: DataTransformation[]): DataSet {
    let result = this.cloneDataSet(data);

    for (const transformation of transformations) {
      result = this.applyTransformation(result, transformation);
    }

    return result;
  }

  private static applyTransformation(data: DataSet, transformation: DataTransformation): DataSet {
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

  private static pivot(data: DataSet, params: any): DataSet {
    const { sourceField, targetField, valueField, groupBy } = params;
    
    if (params.operation === 'elevate') {
      return this.elevateField(data, sourceField, targetField, valueField);
    } else if (params.operation === 'group_elevate') {
      return this.groupElevateField(data, sourceField, groupBy);
    }
    
    return data;
  }

  private static unpivot(data: DataSet, params: any): DataSet {
    const { sourceField, targetField, keyField, sourceFields } = params;
    
    if (params.operation === 'reduce') {
      return this.reduceField(data, sourceField, targetField, keyField);
    } else if (params.operation === 'group_reduce') {
      return this.groupReduceFields(data, sourceFields, targetField, keyField);
    }
    
    return data;
  }

  private static elevateField(data: DataSet, sourceField: string, targetField: string, valueField: string): DataSet {
    const uniqueValues = [...new Set(data.rows.map(row => row[sourceField]))];
    
    const newFields: DataField[] = data.fields.filter(f => f.name !== sourceField);
    newFields.push({
      name: targetField,
      type: 'string',
      role: 'dimension',
      values: uniqueValues
    } as any);
    newFields.push({
      name: valueField,
      type: 'number',
      role: 'measure',
      values: []
    } as any);

    const newRows = data.rows.map(row => {
      const newRow = { ...row };
      delete newRow[sourceField];
      newRow[targetField] = row[sourceField];
      newRow[valueField] = 1;
      return newRow;
    });

    return {
      fields: newFields,
      rows: newRows
    };
  }

  private static reduceField(data: DataSet, sourceField: string, targetField: string, keyField: string): DataSet {
    const newFields: DataField[] = data.fields.filter(f => f.name !== sourceField);
    newFields.push({
      name: keyField,
      type: 'string',
      role: 'dimension',
      values: [sourceField]
    } as any);
    newFields.push({
      name: targetField,
      type: 'number',
      role: 'measure',
      values: []
    } as any);

    const newRows = data.rows.map(row => {
      const newRow = { ...row };
      const value = newRow[sourceField];
      delete newRow[sourceField];
      newRow[keyField] = sourceField;
      newRow[targetField] = value;
      return newRow;
    });

    return {
      fields: newFields,
      rows: newRows
    };
  }

  private static groupElevateField(data: DataSet, sourceField: string, groupBy: string[]): DataSet {
    return data;
  }

  private static groupReduceFields(data: DataSet, sourceFields: string[], targetField: string, keyField: string): DataSet {
    const otherFields = data.fields.filter(f => !sourceFields.includes(f.name));
    const newFields: DataField[] = [...otherFields];
    
    newFields.push({
      name: keyField,
      type: 'string',
      role: 'dimension',
      values: sourceFields
    } as any);
    newFields.push({
      name: targetField,
      type: 'number',
      role: 'measure',
      values: []
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

    return {
      fields: newFields,
      rows: newRows
    };
  }

  private static aggregate(data: DataSet, params: any): DataSet {
    return data;
  }

  private static filter(data: DataSet, params: any): DataSet {
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

    return {
      fields: data.fields,
      rows: filteredRows
    };
  }

  private static sort(data: DataSet, params: any): DataSet {
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

    return {
      fields: data.fields,
      rows: sortedRows
    };
  }

  private static cloneDataSet(data: DataSet): DataSet {
    return JSON.parse(JSON.stringify(data));
  }
}