/**
 * COLUMN堆叠图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { xBandAxis, yLinearAxis } from '../style/Axes';
import { initVChartColumn } from '../init/initVChartColumn';
import { stacked } from '../aggregation/stacked';
import { configResponsive } from '../style/Responsive';

// 创建COLUMN堆叠图表Pipeline
export const createColumnStackedSpecPipeline = () => pipeline([
  initVChartColumn,
  initData,
  stacked,
  xBandAxis,
  yLinearAxis,
  configureLegend,
  configureLabel,
  configureTooltip
], {});