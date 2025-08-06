/**
 * AREA图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { configureAxes } from '../style/Axes';
import { initVChartArea } from '../init/initVChartArea';
import { SortXAxis } from '../sort/SortXAxis';
import { stacked } from '../aggregation/stacked';

// 创建AREA图表Pipeline - 面积图默认使用堆叠模式
export const createAreaSpecPipeline = () => pipeline([
  initVChartArea,
  initData,
  SortXAxis,
  stacked,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});