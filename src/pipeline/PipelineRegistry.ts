/**
 * Pipeline注册表
 * 使用函数映射实现图表Pipeline管理，简洁高效的架构
 */

import { pipeline, PipelineStep, PipelineContext } from './PipelineCore';
import { initData } from './modules/DataModule';
import { configureLegend, configureLabel, configureTooltip, configureAxes } from './modules/StyleModule';
import { initVChartBar, initVChartPie, initVTableList } from './modules/ChartModule';
import { chartAdapterStep } from './modules/ChartAdapterModule';
import { vizSeedInitStep } from './modules/VizSeedInitModule';
import { dataReshapeStep } from './modules/DataReshapeModule';
import { vizSeedFieldMapStep } from './modules/VizSeedFieldMapModule';
import { vizSeedCleanupStep } from './modules/VizSeedCleanupModule';
import { autoChannelMappingStep } from './modules/AutoChannelMappingModule';

// Pipeline函数类型
type PipelineFunction = (context: PipelineContext) => any;

// 创建VChart通用Pipeline（柱状图、折线图、散点图等）
const createVChartPipeline = () => pipeline([
  initVChartBar,
  initData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建VChart饼图Pipeline
const createVChartPiePipeline = () => pipeline([
  initVChartPie,
  initData,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建VTable表格Pipeline
const createVTablePipeline = () => pipeline([
  initVTableList,
  initData
], {});

// 创建VizSeed构建Pipeline - 简化流程，要求用户必须设置字段
const createVizSeedBuildPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    // 1. 基础VizSeed初始化
    vizSeedInitStep,
    
    // 2. 图表适配分析步骤
    chartAdapterStep,
    
    // 3. 数据重塑并更新dataMap
    dataReshapeStep,
    
    // 4. 自动通道映射（根据用户设置的字段）
    autoChannelMappingStep,
    
    // 5. 更新字段映射（基于重塑结果）
    vizSeedFieldMapStep,
    
    // 6. 最终清理 - 只保留5个核心属性
    vizSeedCleanupStep
  ];

  return pipeline(buildVizSeedSteps, {});
};

// Pipeline映射表 - 按照图中的抽象设计
const pipelineMap: Record<string, PipelineFunction> = {
  // VChart图表类型
  'vchart-bar': createVChartPipeline(),
  'vchart-column': createVChartPipeline(), 
  'vchart-line': createVChartPipeline(),
  'vchart-area': createVChartPipeline(),
  'vchart-scatter': createVChartPipeline(),
  
  // VChart饼图类型
  'vchart-pie': createVChartPiePipeline(),
  'vchart-donut': createVChartPiePipeline(),
  
  // VTable表格类型
  'vtable-table': createVTablePipeline(),
  
  // VizSeed构建
  'vizseed-build': createVizSeedBuildPipeline()
};

// 简化的构建规范函数
export const buildSpec = (chartType: string, library: 'vchart' | 'vtable', context: PipelineContext): any => {
  // 构建pipeline key
  const pipelineKey = library === 'vtable' && chartType === 'table' 
    ? 'vtable-table' 
    : `${library}-${chartType}`;
  
  // 获取对应的pipeline
  const selectedPipeline = pipelineMap[pipelineKey];
  
  if (!selectedPipeline) {
    throw new Error(`不支持的图表类型组合: ${pipelineKey}`);
  }
  
  // 执行pipeline并返回结果
  return selectedPipeline(context);
};

// 构建VizSeed对象的函数
export const buildVizSeed = (context: PipelineContext): any => {
  const vizSeedPipeline = pipelineMap['vizseed-build'];
  return vizSeedPipeline(context);
};

// 获取所有支持的pipeline类型
export const getSupportedPipelineTypes = (): string[] => {
  return Object.keys(pipelineMap);
};

// 检查pipeline是否支持
export const isPipelineSupported = (key: string): boolean => {
  return key in pipelineMap;
};