/**
 * 图表规范生成Pipeline函数集合
 * 包含所有图表类型的Spec Pipeline创建函数
 */

import { pipeline } from './PipelineCore';
import { initData } from './modules/spec/DataModule';
import { configureLegend, configureLabel, configureTooltip, configureAxes } from './modules/spec/StyleModule';
import { initVChartBar } from './modules/spec/init/initVChartBar';
import { initVChartLine } from './modules/spec/init/initVChartLine';
import { initVChartArea } from './modules/spec/init/initVChartArea';
import { initVChartScatter } from './modules/spec/init/initVChartScatter';
import { initVChartPie } from './modules/spec/init/initVChartPie';
import { initVTableList } from './modules/spec/init/initVTable';

// 创建BAR图表Pipeline
export const createBarSpecPipeline = () => pipeline([
  initVChartBar,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建COLUMN图表Pipeline
export const createColumnSpecPipeline = () => pipeline([
  initVChartBar,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建LINE图表Pipeline
export const createLineSpecPipeline = () => pipeline([
  initVChartLine,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建AREA图表Pipeline
export const createAreaSpecPipeline = () => pipeline([
  initVChartArea,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建SCATTER图表Pipeline
export const createScatterSpecPipeline = () => pipeline([
  initVChartScatter,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建PIE图表Pipeline
export const createPieSpecPipeline = () => pipeline([
  initVChartPie,
  initData,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建DONUT图表Pipeline
export const createDonutSpecPipeline = () => pipeline([
  initVChartPie,
  initData,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建TABLE图表Pipeline
export const createTableSpecPipeline = () => pipeline([
  initVTableList,
  initData
], {});