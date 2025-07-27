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

// 创建AREA图表Pipeline
export const createAreaSpecPipeline = () => pipeline([
  initVChartArea,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});