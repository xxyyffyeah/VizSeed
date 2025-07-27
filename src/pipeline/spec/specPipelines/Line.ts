/**
 * LINE图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend, configureLabel, configureTooltip, configureAxes } from '../StyleModule';
import { initVChartLine } from '../init/initVChartLine';

// 创建LINE图表Pipeline
export const createLineSpecPipeline = () => pipeline([
  initVChartLine,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});