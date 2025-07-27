/**
 * BAR图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { xLinearAxis, yBandAxis } from '../style/Axes';
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