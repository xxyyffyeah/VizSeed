/**
 * AREA图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend, configureLabel, configureTooltip, configureAxes } from '../StyleModule';
import { initVChartArea } from '../init/initVChartArea';

// 创建AREA图表Pipeline
export const createAreaSpecPipeline = () => pipeline([
  initVChartArea,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});