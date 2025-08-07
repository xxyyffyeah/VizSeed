/**
 * PIVOT_TABLE图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initVTablePivot } from '../init/initVTablePivot';

// 创建PIVOT_TABLE图表Pipeline
export const createPivotTableSpecPipeline = () => pipeline([
  initVTablePivot
], {});