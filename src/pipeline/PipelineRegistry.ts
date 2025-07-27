/**
 * Pipeline注册表
 * 使用函数映射实现图表Pipeline管理，简洁高效的架构
 */

import { PipelineContext } from './PipelineCore';
import { ChartType } from '../types/charts';


// 规范生成Pipeline映射表 - 每个图表类型使用专门的Pipeline
const specPipelineMap: Record<string, () => Promise<any>> = {
  // VChart基础图表类型
  [ChartType.BAR]: () => import('./spec/specPipelines/Bar').then(m => m.createBarSpecPipeline),
  [ChartType.BAR_STACKED]: () => import('./spec/specPipelines/Bar_stacked').then(m => m.createBarStackedSpecPipeline),
  [ChartType.BAR_GROUPED]: () => import('./spec/specPipelines/Bar_grouped').then(m => m.createBarGroupedSpecPipeline),
  [ChartType.BAR_PERCENT]: () => import('./spec/specPipelines/Bar_percent').then(m => m.createBarPercentSpecPipeline),
  [ChartType.COLUMN]: () => import('./spec/specPipelines/Column').then(m => m.createColumnSpecPipeline),
  [ChartType.COLUMN_STACKED]: () => import('./spec/specPipelines/Column_stacked').then(m => m.createColumnStackedSpecPipeline),
  [ChartType.COLUMN_GROUPED]: () => import('./spec/specPipelines/Column_grouped').then(m => m.createColumnGroupedSpecPipeline),
  [ChartType.COLUMN_PERCENT]: () => import('./spec/specPipelines/Column_percent').then(m => m.createColumnPercentSpecPipeline),
  [ChartType.LINE]: () => import('./spec/specPipelines/Line').then(m => m.createLineSpecPipeline),
  [ChartType.AREA]: () => import('./spec/specPipelines/Area').then(m => m.createAreaSpecPipeline),
  [ChartType.AREA_STACKED]: () => import('./spec/specPipelines/Area_stacked').then(m => m.createAreaStackedSpecPipeline),
  [ChartType.AREA_PERCENT]: () => import('./spec/specPipelines/Area_percent').then(m => m.createAreaPercentSpecPipeline),
  [ChartType.SCATTER]: () => import('./spec/specPipelines/Scatter').then(m => m.createScatterSpecPipeline),
  
  // VChart饼图类型
  [ChartType.PIE]: () => import('./spec/specPipelines/Pie').then(m => m.createPieSpecPipeline),
  [ChartType.DONUT]: () => import('./spec/specPipelines/Donut').then(m => m.createDonutSpecPipeline),
  
  // VTable表格类型
  [ChartType.TABLE]: () => import('./spec/specPipelines/Table').then(m => m.createTableSpecPipeline)
};

// VizSeed构建Pipeline映射表 - 每个图表类型使用专门的Pipeline
const vizSeedPipelineMap: Record<string, () => Promise<any>> = {
  // VChart基础图表类型
  [ChartType.BAR]: () => import('./vizSeed/vizSeedPipelines/Bar').then(m => m.createBarVizSeedPipeline),
  [ChartType.BAR_STACKED]: () => import('./vizSeed/vizSeedPipelines/Bar').then(m => m.createBarVizSeedPipeline),
  [ChartType.BAR_GROUPED]: () => import('./vizSeed/vizSeedPipelines/Bar').then(m => m.createBarVizSeedPipeline),
  [ChartType.BAR_PERCENT]: () => import('./vizSeed/vizSeedPipelines/Bar').then(m => m.createBarVizSeedPipeline),
  [ChartType.COLUMN]: () => import('./vizSeed/vizSeedPipelines/Column').then(m => m.createColumnVizSeedPipeline),
  [ChartType.COLUMN_STACKED]: () => import('./vizSeed/vizSeedPipelines/Column').then(m => m.createColumnVizSeedPipeline),
  [ChartType.COLUMN_GROUPED]: () => import('./vizSeed/vizSeedPipelines/Column').then(m => m.createColumnVizSeedPipeline),
  [ChartType.COLUMN_PERCENT]: () => import('./vizSeed/vizSeedPipelines/Column').then(m => m.createColumnVizSeedPipeline),
  [ChartType.LINE]: () => import('./vizSeed/vizSeedPipelines/Line').then(m => m.createLineVizSeedPipeline),
  [ChartType.AREA]: () => import('./vizSeed/vizSeedPipelines/Area').then(m => m.createAreaVizSeedPipeline),
  [ChartType.AREA_STACKED]: () => import('./vizSeed/vizSeedPipelines/Area').then(m => m.createAreaVizSeedPipeline),
  [ChartType.AREA_PERCENT]: () => import('./vizSeed/vizSeedPipelines/Area').then(m => m.createAreaVizSeedPipeline),
  [ChartType.SCATTER]: () => import('./vizSeed/vizSeedPipelines/Scatter').then(m => m.createScatterVizSeedPipeline),
  
  // VChart饼图类型
  [ChartType.PIE]: () => import('./vizSeed/vizSeedPipelines/Pie').then(m => m.createPieVizSeedPipeline),
  [ChartType.DONUT]: () => import('./vizSeed/vizSeedPipelines/Donut').then(m => m.createDonutVizSeedPipeline),
  
  // VTable表格类型
  [ChartType.TABLE]: () => import('./vizSeed/vizSeedPipelines/Table').then(m => m.createTableVizSeedPipeline)
};

// 简化的构建规范函数 - 按需加载Pipeline
export const buildSpec = async (chartType: string, context: PipelineContext): Promise<any> => {
  const selectedPipeline = specPipelineMap[chartType];
  
  if (!selectedPipeline) {
    throw new Error(`不支持的图表类型: ${chartType}`);
  }
  
  try {
    const pipelineFactory = await selectedPipeline();
    return pipelineFactory()(context);
  } catch (error) {
    throw new Error(`加载图表类型 ${chartType} 失败: ${error}`);
  }
};

// 构建VizSeed对象的函数 - 按需加载Pipeline
export const buildVizSeed = async (chartType: string, context: PipelineContext): Promise<any> => {
  const vizSeedPipeline = vizSeedPipelineMap[chartType];
  
  if (!vizSeedPipeline) {
    throw new Error(`不支持的VizSeed图表类型: ${chartType}`);
  }
  
  try {
    const pipelineFactory = await vizSeedPipeline();
    return pipelineFactory()(context);
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