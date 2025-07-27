/**
 * COLUMN图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend, configureLabel, configureTooltip, configureAxes } from '../StyleModule';
import { initVChartBar } from '../init/initVChartBar';

// 创建COLUMN图表Pipeline
export const createColumnSpecPipeline = () => pipeline([
  initVChartBar,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});