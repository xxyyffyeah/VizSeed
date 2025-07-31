/**
 * PIE图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { configureLegend } from '../style/Legend';
import { configureLabel } from '../style/Label';
import { configureTooltip } from '../style/Tooltip';
import { initVChartPie } from '../init/initVChartPie';
import { configureColor } from '../style/Color';
import { configurePieStyle } from '../style/PieStyle';

// 创建PIE图表Pipeline
export const createPieSpecPipeline = () => pipeline([
  initVChartPie,
  initData,
  configureLegend,
  configureLabel,
  configureTooltip,
  configureColor,
  configurePieStyle
], {});