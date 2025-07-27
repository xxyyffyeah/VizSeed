/**
 * SCATTER图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { configureAxes } from '../style/Axes';
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