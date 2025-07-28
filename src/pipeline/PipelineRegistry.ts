/**
 * Pipeline注册表
 * 使用函数映射实现图表Pipeline管理，简洁高效的架构
 */

import { PipelineContext } from './PipelineCore';
import { ChartType } from '../types/charts';

// 静态导入所有spec pipelines
import * as SpecPipelines from './spec/specPipelines';

// 静态导入所有vizSeed pipelines  
import * as VizSeedPipelines from './vizSeed/vizSeedPipelines';


// 规范生成Pipeline映射表 - 每个图表类型使用专门的Pipeline
const specPipelineMap: Record<string, () => any> = {
  // VChart基础图表类型
  [ChartType.BAR]: SpecPipelines.createBarSpecPipeline,
  [ChartType.BAR_STACKED]: SpecPipelines.createBarStackedSpecPipeline,
  [ChartType.BAR_GROUPED]: SpecPipelines.createBarGroupedSpecPipeline,
  [ChartType.BAR_PERCENT]: SpecPipelines.createBarPercentSpecPipeline,
  [ChartType.COLUMN]: SpecPipelines.createColumnSpecPipeline,
  [ChartType.COLUMN_STACKED]: SpecPipelines.createColumnStackedSpecPipeline,
  [ChartType.COLUMN_GROUPED]: SpecPipelines.createColumnGroupedSpecPipeline,
  [ChartType.COLUMN_PERCENT]: SpecPipelines.createColumnPercentSpecPipeline,
  [ChartType.LINE]: SpecPipelines.createLineSpecPipeline,
  [ChartType.AREA]: SpecPipelines.createAreaSpecPipeline,
  [ChartType.AREA_STACKED]: SpecPipelines.createAreaStackedSpecPipeline,
  [ChartType.AREA_PERCENT]: SpecPipelines.createAreaPercentSpecPipeline,
  [ChartType.SCATTER]: SpecPipelines.createScatterSpecPipeline,
  
  // VChart饼图类型
  [ChartType.PIE]: SpecPipelines.createPieSpecPipeline,
  [ChartType.DONUT]: SpecPipelines.createDonutSpecPipeline,
  
  // VTable表格类型
  [ChartType.TABLE]: SpecPipelines.createTableSpecPipeline
};

// VizSeed构建Pipeline映射表 - 每个图表类型使用专门的Pipeline
const vizSeedPipelineMap: Record<string, () => any> = {
  // VChart基础图表类型
  [ChartType.BAR]: VizSeedPipelines.createBarVizSeedPipeline,
  [ChartType.BAR_STACKED]: VizSeedPipelines.createBarVizSeedPipeline,
  [ChartType.BAR_GROUPED]: VizSeedPipelines.createBarVizSeedPipeline,
  [ChartType.BAR_PERCENT]: VizSeedPipelines.createBarVizSeedPipeline,
  [ChartType.COLUMN]: VizSeedPipelines.createColumnVizSeedPipeline,
  [ChartType.COLUMN_STACKED]: VizSeedPipelines.createColumnVizSeedPipeline,
  [ChartType.COLUMN_GROUPED]: VizSeedPipelines.createColumnVizSeedPipeline,
  [ChartType.COLUMN_PERCENT]: VizSeedPipelines.createColumnVizSeedPipeline,
  [ChartType.LINE]: VizSeedPipelines.createLineVizSeedPipeline,
  [ChartType.AREA]: VizSeedPipelines.createAreaVizSeedPipeline,
  [ChartType.AREA_STACKED]: VizSeedPipelines.createAreaVizSeedPipeline,
  [ChartType.AREA_PERCENT]: VizSeedPipelines.createAreaVizSeedPipeline,
  [ChartType.SCATTER]: VizSeedPipelines.createScatterVizSeedPipeline,
  
  // VChart饼图类型
  [ChartType.PIE]: VizSeedPipelines.createPieVizSeedPipeline,
  [ChartType.DONUT]: VizSeedPipelines.createDonutVizSeedPipeline,
  
  // VTable表格类型
  [ChartType.TABLE]: VizSeedPipelines.createTableVizSeedPipeline
};

// 简化的构建规范函数 - 同步版本
export const buildSpec = (chartType: string, context: PipelineContext): any => {
  const selectedPipeline = specPipelineMap[chartType];
  
  if (!selectedPipeline) {
    throw new Error(`不支持的图表类型: ${chartType}`);
  }
  
  try {
    return selectedPipeline()(context);
  } catch (error) {
    throw new Error(`加载图表类型 ${chartType} 失败: ${error}`);
  }
};

// 构建VizSeed对象的函数 - 同步版本
export const buildVizSeed = (chartType: string, context: PipelineContext): any => {
  const vizSeedPipeline = vizSeedPipelineMap[chartType];
  
  if (!vizSeedPipeline) {
    throw new Error(`不支持的VizSeed图表类型: ${chartType}`);
  }
  
  try {
    return vizSeedPipeline()(context);
  } catch (error) {
    throw new Error(`加载VizSeed图表类型 ${chartType} 失败: ${error}`);
  }
};

// 获取所有支持的pipeline类型
export const getSupportedPipelineTypes = (): string[] => {
  return [...Object.keys(specPipelineMap), ...Object.keys(vizSeedPipelineMap)];
};

// 检查pipeline是否支持
export const isPipelineSupported = (key: ChartType): boolean => {
  return key in specPipelineMap || key in vizSeedPipelineMap;
};