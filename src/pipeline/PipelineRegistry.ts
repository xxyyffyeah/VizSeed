/**
 * Pipeline注册表
 * 管理不同图表类型的Pipeline策略
 */

import { ChartPipelineStrategy, VChartBarPipelineStrategy, VChartPiePipelineStrategy, VTableListTablePipelineStrategy, VizSeedBuildPipelineStrategy } from './strategies/ChartPipelineStrategy';

// 图表类型和库的组合键
export type ChartPipelineKey = 'vchart-bar' | 'vchart-pie' | 'vtable-table' | 'vizseed-build';

export class PipelineRegistry {
  private static strategies: Map<ChartPipelineKey, ChartPipelineStrategy> = new Map();

  // 注册默认策略
  static {
    PipelineRegistry.register('vchart-bar', new VChartBarPipelineStrategy());
    PipelineRegistry.register('vchart-pie', new VChartPiePipelineStrategy());
    PipelineRegistry.register('vtable-table', new VTableListTablePipelineStrategy());
    PipelineRegistry.register('vizseed-build', new VizSeedBuildPipelineStrategy());
  }

  // 注册新策略
  static register(key: ChartPipelineKey, strategy: ChartPipelineStrategy): void {
    this.strategies.set(key, strategy);
  }

  // 获取策略
  static getStrategy(key: ChartPipelineKey): ChartPipelineStrategy | undefined {
    return this.strategies.get(key);
  }

  // 获取所有已注册的策略键
  static getRegisteredKeys(): ChartPipelineKey[] {
    return Array.from(this.strategies.keys());
  }

  // 检查策略是否已注册
  static hasStrategy(key: ChartPipelineKey): boolean {
    return this.strategies.has(key);
  }

  // 根据图表类型和库生成策略键
  static createKey(library: 'vchart' | 'vtable', chartType: string): ChartPipelineKey {
    const key = `${library}-${chartType}`;
    
    // 映射到已知的策略键
    switch (key) {
      case 'vchart-bar':
      case 'vchart-column':
      case 'vchart-line':
      case 'vchart-area':
      case 'vchart-scatter':
        return 'vchart-bar'; // 这些图表类型都使用相似的数据结构
      case 'vchart-pie':
      case 'vchart-donut':
        return 'vchart-pie';
      case 'vtable-table':
        return 'vtable-table';
      default:
        throw new Error(`不支持的图表类型组合: ${key}`);
    }
  }
}