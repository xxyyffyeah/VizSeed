/**
 * Pipeline Builder 核心架构
 * 用于构建VizSeed对象和图表规范的管道式处理系统
 */

// Pipeline上下文接口
export interface PipelineContext {
  data?: any;
  vizSeed?: any;
  chartConfig?: any;
  metadata?: any;
  [key: string]: any;
}

// Pipeline管道函数类型
export type PipelineStep<T = any> = (input: T, context: PipelineContext) => T;

// Pipeline构建器
export class PipelineBuilder<T = any> {
  private steps: PipelineStep<T>[] = [];

  constructor(private initialValue: T) {}

  // 添加管道步骤
  addStep(step: PipelineStep<T>): PipelineBuilder<T> {
    this.steps.push(step);
    return this;
  }

  // 批量添加管道步骤
  addSteps(steps: PipelineStep<T>[]): PipelineBuilder<T> {
    this.steps.push(...steps);
    return this;
  }

  // 执行管道
  execute(context: PipelineContext = {}): T {
    return this.steps.reduce((result, step) => {
      return step(result, context);
    }, this.initialValue);
  }

  // 静态工厂方法
  static create<T>(initialValue: T): PipelineBuilder<T> {
    return new PipelineBuilder(initialValue);
  }
}

// 通用管道函数工厂
export const pipeline = <T>(steps: PipelineStep<T>[], initialValue: T) => {
  return (context: PipelineContext) => {
    return steps.reduce((result, step) => {
      return step(result, context);
    }, initialValue);
  };
};