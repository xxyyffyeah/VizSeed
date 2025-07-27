/**
 * BAR图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend, configureLabel, configureTooltip, xLinearAxis, yBandAxis } from '../StyleModule';
import { initVChartBar } from '../init/initVChartBar';

// 创建BAR图表Pipeline
export const createBarSpecPipeline = () => pipeline([
  initVChartBar,
  initData,
  xLinearAxis,
  yBandAxis,
  configureLegend,
  configureLabel,
  configureTooltip
], {});