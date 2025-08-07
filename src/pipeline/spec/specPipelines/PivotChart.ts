/**
 * PIVOT_CHART图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initVTablePivotChart } from '../init/initVTablePivotChart';

// 创建PIVOT_CHART图表Pipeline
export const createPivotChartSpecPipeline = () => pipeline([
  initVTablePivotChart
], {});