/**
 * Pipeline 核心类型和工具函数
 * 简化的函数式管道处理系统
 */

// Pipeline上下文接口
export interface PipelineContext {
  data?: any;
  chartConfig?: any;
  transformations?: any[];
  visualStyle?: any;
  [key: string]: any;
}

// Pipeline管道函数类型
export type PipelineStep<T = any> = (input: T, context: PipelineContext) => T;

// 管道函数工厂 - 创建可执行的管道函数
export const pipeline = <T>(steps: PipelineStep<T>[], initialValue: T) => {
  return (context: PipelineContext) => {
    return steps.reduce((result, step) => {
      return step(result, context);
    }, initialValue);
  };
};