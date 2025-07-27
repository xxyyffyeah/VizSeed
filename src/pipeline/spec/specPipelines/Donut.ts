/**
 * DONUT图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend, configureLabel, configureTooltip } from '../StyleModule';
import { initVChartPie } from '../init/initVChartPie';

// 创建DONUT图表Pipeline
export const createDonutSpecPipeline = () => pipeline([
  initVChartPie,
  initData,
  configureLegend,
  configureLabel,
  configureTooltip
], {});