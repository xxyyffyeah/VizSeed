/**
 * Pipeline 核心类型和工具函数
 * 简化的函数式管道处理系统
 */

// 重塑配置接口
export interface ReshapeConfig {
  strategy: 'auto' | 'elevate' | 'reduce' | 'none';
  targetDimension?: string;  // 降维时的目标维度
  enabled: boolean;          // 是否启用重塑
}

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
}

// Pipeline上下文接口
export interface PipelineContext {
  data?: any;
  chartConfig?: any;
  fieldMap?: FieldMap;        // 完整字段映射定义
  fieldSelection?: FieldSelection;  // 用户字段选择
  dataMap?: Record<string, any>[]; // 数据映射数组
  visualStyle?: any;
  
  // 维度重塑相关
  reshapeConfig?: ReshapeConfig;
  analysisResult?: any;       // 图表适配分析结果
  reshapeDecision?: 'elevate' | 'reduce' | 'none';  // 重塑决策
  
  [key: string]: any;
}

// Pipeline步骤结果接口
export interface PipelineStepResult<T = any> {
  result: T;
  context: PipelineContext;
}

// Pipeline管道函数类型
export type PipelineStep<T = any> = (input: T, context: PipelineContext) => T | PipelineStepResult<T>;

// 检查返回值是否为PipelineStepResult
const isPipelineStepResult = <T>(value: any): value is PipelineStepResult<T> => {
  return value && typeof value === 'object' && 'result' in value && 'context' in value;
};

// 管道函数工厂 - 创建可执行的管道函数，支持context更新
export const pipeline = <T>(steps: PipelineStep<T>[], initialValue: T) => {
  return (initialContext: PipelineContext) => {
    let currentContext = initialContext;
    let currentResult = initialValue;
    
    for (const step of steps) {
      const stepResult = step(currentResult, currentContext);
      
      // 如果步骤返回了标准的PipelineStepResult，使用新的context
      if (isPipelineStepResult<T>(stepResult)) {
        currentContext = stepResult.context;
        currentResult = stepResult.result;
      } else {
        // 普通返回值，保持原有context
        currentResult = stepResult;
      }
    }
    
    return currentResult;
  };
};