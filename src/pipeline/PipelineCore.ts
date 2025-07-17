/**
 * Pipeline 核心类型和工具函数
 * 简化的函数式管道处理系统
 */

import { NestedMeasure } from "../types";

// 字段定义接口
export interface FieldDefinition {
  id: string;
  type: 'string' | 'number' | 'float' | 'date' | 'boolean';
  alias: string;
  location: 'dimension' | 'measure';
  domain?: any[];
  format?: Record<string, any>;
}

// 完整字段映射接口
export interface FieldMap {
  [fieldId: string]: FieldDefinition;
}

// 用户字段选择接口
export interface FieldSelection {
  dimensions: string[];  // 用户选择的维度字段ID
  measures: string[];    // 用户选择的指标字段ID
  groupMeasure?: NestedMeasure<string>[]; // 可选的分组指标字段ID
}

// Pipeline上下文接口
export interface PipelineContext {
  chartConfig: any;
  fieldMap: FieldMap;        // 完整字段映射定义
  fieldSelection: FieldSelection;  // 用户字段选择
  data: Record<string, any>[]; // 数据映射数组
  visualStyle?: any;
  
  // 维度重塑相关
  analysisResult?: any;       // 图表适配分析结果
  
  [key: string]: any;
}

// Pipeline管道函数类型 - 简化为纯函数
export type PipelineStep<T = any> = (input: T, context: PipelineContext) => T;

// 简化的管道函数工厂 - 使用reduce实现函数式组合
export const pipeline = <T>(steps: PipelineStep<T>[], initialValue: T) => {
  return (context: PipelineContext) => {
    return steps.reduce((result, step) => {
      return step(result, context);
    }, initialValue);
  };
};

