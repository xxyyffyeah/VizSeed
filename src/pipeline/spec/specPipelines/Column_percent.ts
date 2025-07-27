/**
 * COLUMN百分比图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { xBandAxis, yLinearAxis } from '../style/Axes';
import { initVChartColumn } from '../init/initVChartColumn';
import { percent } from '../aggregation/percent';
import { configResponsive } from '../style/Responsive';

// 创建COLUMN百分比图表Pipeline
export const createColumnPercentSpecPipeline = () => pipeline([
  initVChartColumn,
  initData,
  percent,
  xBandAxis,
  yLinearAxis,
  configureLegend,
  configureLabel,
  configureTooltip
], {});