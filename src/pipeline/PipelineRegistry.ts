/**
 * Pipeline注册表
 * 使用函数映射实现图表Pipeline管理，简洁高效的架构
 */

import { PipelineContext } from './PipelineCore';
import { ChartType } from '../types/charts';
import {
  createBarSpecPipeline,
  createColumnSpecPipeline,
  createLineSpecPipeline,
  createAreaSpecPipeline,
  createScatterSpecPipeline,
  createPieSpecPipeline,
  createDonutSpecPipeline,
  createTableSpecPipeline
} from './SpecPipelines';
import {
  createBarVizSeedPipeline,
  createColumnVizSeedPipeline,
  createLineVizSeedPipeline,
  createAreaVizSeedPipeline,
  createScatterVizSeedPipeline,
  createPieVizSeedPipeline,
  createDonutVizSeedPipeline,
  createTableVizSeedPipeline
} from './VizSeedPipelines';

// Pipeline函数类型
type PipelineFunction = (context: PipelineContext) => any;


// 规范生成Pipeline映射表 - 每个图表类型使用专门的Pipeline
const specPipelineMap: Record<string, () => PipelineFunction> = {
  // VChart基础图表类型
  [ChartType.BAR]: createBarSpecPipeline,
  [ChartType.COLUMN]: createColumnSpecPipeline, 
  [ChartType.LINE]: createLineSpecPipeline,
  [ChartType.AREA]: createAreaSpecPipeline,
  [ChartType.SCATTER]: createScatterSpecPipeline,
  
  // VChart饼图类型
  [ChartType.PIE]: createPieSpecPipeline,
  [ChartType.DONUT]: createDonutSpecPipeline,
  
  // VTable表格类型
  [ChartType.TABLE]: createTableSpecPipeline
};

// VizSeed构建Pipeline映射表 - 每个图表类型使用专门的Pipeline
const vizSeedPipelineMap: Record<string, () => PipelineFunction> = {
  // VChart基础图表类型
  [ChartType.BAR]: createBarVizSeedPipeline,
  [ChartType.COLUMN]: createColumnVizSeedPipeline,
  [ChartType.LINE]: createLineVizSeedPipeline,
  [ChartType.AREA]: createAreaVizSeedPipeline,
  [ChartType.SCATTER]: createScatterVizSeedPipeline,
  
  // VChart饼图类型
  [ChartType.PIE]: createPieVizSeedPipeline,
  [ChartType.DONUT]: createDonutVizSeedPipeline,
  
  // VTable表格类型
  [ChartType.TABLE]: createTableVizSeedPipeline
};

// 简化的构建规范函数 - 按需加载Pipeline
export const buildSpec = (chartType: string, context: PipelineContext): any => {
  // 直接使用chartType作为key
  const selectedPipeline = specPipelineMap[chartType];
  
  if (!selectedPipeline) {
    throw new Error(`不支持的图表类型: ${chartType}`);
  }
  
  // 执行pipeline并返回结果
  return selectedPipeline()(context);
};

// 构建VizSeed对象的函数 - 按需加载Pipeline
export const buildVizSeed = (chartType: string, context: PipelineContext): any => {
  const vizSeedPipeline = vizSeedPipelineMap[chartType];
  
  if (!vizSeedPipeline) {
    throw new Error(`不支持的VizSeed图表类型: ${chartType}`);
  }
  
  return vizSeedPipeline()(context);
};

// 获取所有支持的pipeline类型
export const getSupportedPipelineTypes = (): string[] => {
  return [...Object.keys(specPipelineMap), ...Object.keys(vizSeedPipelineMap)];
};

// 检查pipeline是否支持
export const isPipelineSupported = (key: string): boolean => {
  return key in specPipelineMap || key in vizSeedPipelineMap;
};