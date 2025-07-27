/**
 * AREA堆叠图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { xBandAxis, yLinearAxis } from '../style/Axes';
import { initVChartArea } from '../init/initVChartArea';
import { stacked } from '../aggregation/stacked';

// 创建AREA堆叠图表Pipeline
export const createAreaStackedSpecPipeline = () => pipeline([
  initVChartArea,
  initData,
  stacked,
  xBandAxis,
  yLinearAxis,
  configureLegend,
  configureLabel,
  configureTooltip
], {});