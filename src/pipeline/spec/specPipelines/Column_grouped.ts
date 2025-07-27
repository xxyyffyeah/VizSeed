/**
 * COLUMN分组图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { xBandAxis, yLinearAxis } from '../style/Axes';
import { initVChartColumn } from '../init/initVChartColumn';
import { colGrouped } from '../aggregation/grouped';

// 创建COLUMN分组图表Pipeline
export const createColumnGroupedSpecPipeline = () => pipeline([
  initVChartColumn,
  initData,
  colGrouped,
  xBandAxis,
  yLinearAxis,
  configureLegend,
  configureLabel,
  configureTooltip
], {});