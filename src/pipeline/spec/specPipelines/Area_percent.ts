/**
 * AREA百分比图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { xBandAxis, yLinearAxis } from '../style/Axes';
import { initVChartArea } from '../init/initVChartArea';
import { percent } from '../aggregation/percent';
import { SortXAxis } from '../sort/SortXAxis';

// 创建AREA百分比图表Pipeline
export const createAreaPercentSpecPipeline = () => pipeline([
  initVChartArea,
  initData,
  SortXAxis,
  percent,
  xBandAxis,
  yLinearAxis,
  configureLegend,
  configureLabel,
  configureTooltip
], {});