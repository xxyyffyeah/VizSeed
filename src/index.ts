// 核心构建器和数据集
import { VizSeedBuilder } from './builder/VizSeedBuilder';
export { VizSeedBuilder } from './builder/VizSeedBuilder';
export { DataSet } from './datasets/DataSet';

// 完整类型定义
export * from './types';

// Pipeline工具（可选，高级用户使用）
export { pipeline } from './pipeline/PipelineCore';

// 数据处理工具
export { DataProcessor } from './utils/DataProcessor';

// 版本信息
export const VERSION = '1.1.3';

// 默认导出（主要入口）
export default VizSeedBuilder;