/**
 * DONUT图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { initVChartDonut } from '../init/initVChartDonut';

// 创建DONUT图表Pipeline
export const createDonutSpecPipeline = () => pipeline([
  initVChartDonut,
  initData,
  configureLegend,
  configureLabel,
  configureTooltip
], {});