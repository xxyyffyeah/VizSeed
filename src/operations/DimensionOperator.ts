import { DataTransformation } from '../types/data';

export class DimensionOperator {
  public static elevate(field: string, targetField?: string): DataTransformation {
    return {
      type: 'pivot',
      params: {
        operation: 'elevate',
        sourceField: field,
        targetField: targetField || `${field}_dimension`,
        valueField: `${field}_value`
      }
    };
  }

  public static reduce(field: string, targetField?: string): DataTransformation {
    return {
      type: 'unpivot',
      params: {
        operation: 'reduce',
        sourceField: field,
        targetField: targetField || `${field}_measure`,
        keyField: `${field}_key`
      }
    };
  }

  public static groupElevate(field: string, groupBy: string[]): DataTransformation {
    return {
      type: 'pivot',
      params: {
        operation: 'group_elevate',
        sourceField: field,
        groupBy: groupBy,
        aggregateFunction: 'sum'
      }
    };
  }

  public static groupReduce(fields: string[], targetField?: string): DataTransformation {
    return {
      type: 'unpivot',
      params: {
        operation: 'group_reduce',
        sourceFields: fields,
        targetField: targetField || 'value',
        keyField: 'variable'
      }
    };
  }

  public static aggregate(
    fields: string[], 
    groupBy: string[], 
    aggregation: 'sum' | 'avg' | 'count' | 'max' | 'min' = 'sum'
  ): DataTransformation {
    return {
      type: 'aggregate',
      params: {
        operation: 'aggregate',
        fields: fields,
        groupBy: groupBy,
        aggregation: aggregation
      }
    };
  }

  public static filter(field: string, operator: string, value: any): DataTransformation {
    return {
      type: 'filter',
      params: {
        operation: 'filter',
        field: field,
        operator: operator,
        value: value
      }
    };
  }

  public static sort(field: string, direction: 'asc' | 'desc' = 'asc'): DataTransformation {
    return {
      type: 'sort',
      params: {
        operation: 'sort',
        field: field,
        direction: direction
      }
    };
  }
}