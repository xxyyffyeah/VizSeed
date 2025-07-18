/**
 * Pipeline注册表
 * 使用函数映射实现图表Pipeline管理，简洁高效的架构
 */

import { PipelineContext } from './PipelineCore';
import { ChartType } from '../types/charts';

// Pipeline函数类型
type PipelineFunction = (context: PipelineContext) => any;


// 规范生成Pipeline映射表 - 每个图表类型使用专门的Pipeline
const specPipelineMap: Record<string, () => Promise<any>> = {
  // VChart基础图表类型
  [ChartType.BAR]: () => import('./spec/SpecPipelines').then(m => m.createBarSpecPipeline),
  [ChartType.COLUMN]: () => import('./spec/SpecPipelines').then(m => m.createColumnSpecPipeline),
  [ChartType.LINE]: () => import('./spec/SpecPipelines').then(m => m.createLineSpecPipeline),
  [ChartType.AREA]: () => import('./spec/SpecPipelines').then(m => m.createAreaSpecPipeline),
  [ChartType.SCATTER]: () => import('./spec/SpecPipelines').then(m => m.createScatterSpecPipeline),
  
  // VChart饼图类型
  [ChartType.PIE]: () => import('./spec/SpecPipelines').then(m => m.createPieSpecPipeline),
  [ChartType.DONUT]: () => import('./spec/SpecPipelines').then(m => m.createDonutSpecPipeline),
  
  // VTable表格类型
  [ChartType.TABLE]: () => import('./spec/SpecPipelines').then(m => m.createTableSpecPipeline)
};

// VizSeed构建Pipeline映射表 - 每个图表类型使用专门的Pipeline
const vizSeedPipelineMap: Record<string, () => Promise<any>> = {
  // VChart基础图表类型
  [ChartType.BAR]: () => import('./vizSeed/vizSeedPipelines/BarVizSeedPipeline').then(m => m.createBarVizSeedPipeline),
  [ChartType.COLUMN]: () => import('./vizSeed/vizSeedPipelines/ColumnVizSeedPipeline').then(m => m.createColumnVizSeedPipeline),
  [ChartType.LINE]: () => import('./vizSeed/vizSeedPipelines/LineVizSeedPipeline').then(m => m.createLineVizSeedPipeline),
  [ChartType.AREA]: () => import('./vizSeed/vizSeedPipelines/AreaVizSeedPipeline').then(m => m.createAreaVizSeedPipeline),
  [ChartType.SCATTER]: () => import('./vizSeed/vizSeedPipelines/ScatterVizSeedPipeline').then(m => m.createScatterVizSeedPipeline),
  
  // VChart饼图类型
  [ChartType.PIE]: () => import('./vizSeed/vizSeedPipelines/PieVizSeedPipeline').then(m => m.createPieVizSeedPipeline),
  [ChartType.DONUT]: () => import('./vizSeed/vizSeedPipelines/DonutVizSeedPipeline').then(m => m.createDonutVizSeedPipeline),
  
  // VTable表格类型
  [ChartType.TABLE]: () => import('./vizSeed/vizSeedPipelines/TableVizSeedPipeline').then(m => m.createTableVizSeedPipeline)
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