/**
 * SCATTER图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend, configureLabel, configureTooltip, configureAxes } from '../StyleModule';
import { initVChartScatter } from '../init/initVChartScatter';

// 创建SCATTER图表Pipeline
export const createScatterSpecPipeline = () => pipeline([
  initVChartScatter,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});