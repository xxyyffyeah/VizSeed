/**
 * BAR图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { xLinearAxis, yBandAxis } from '../style/Axes';
import { stacked } from '../aggregation/stacked';
import { initVChartBar } from '../init/initVChartBar';
import { configureColor } from '../style/Color';

// 创建BAR图表Pipeline
export const createBarStackedSpecPipeline = () => pipeline([
  initVChartBar,
  initData,
  stacked,
  xLinearAxis,
  yBandAxis,
  configureColor,
  configureLegend,
  configureLabel,
  configureTooltip
], {});