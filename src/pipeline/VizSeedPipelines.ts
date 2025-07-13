/**
 * VizSeed构建Pipeline函数集合
 * 使用共享步骤避免重复代码
 */

import { pipeline, PipelineStep } from './PipelineCore';
import { chartAdapterStep } from './modules/vizSeed/ChartAdapterModule';
import { vizSeedInitStep } from './modules/vizSeed/VizSeedInitModule';
import { dataReshapeStep } from './modules/vizSeed/DataReshapeModule';
import { vizSeedCleanupStep } from './modules/vizSeed/VizSeedCleanupModule';
import { autoChannelMappingStep } from './modules/vizSeed/AutoChannelMappingModule';

// 创建BAR图表VizSeed Pipeline
export const createBarVizSeedPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildVizSeedSteps, {});
};

// 创建COLUMN图表VizSeed Pipeline
export const createColumnVizSeedPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildVizSeedSteps, {});
};

// 创建LINE图表VizSeed Pipeline
export const createLineVizSeedPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildVizSeedSteps, {});
};

// 创建AREA图表VizSeed Pipeline
export const createAreaVizSeedPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildVizSeedSteps, {});
};

// 创建SCATTER图表VizSeed Pipeline
export const createScatterVizSeedPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildVizSeedSteps, {});
};

// 创建PIE图表VizSeed Pipeline
export const createPieVizSeedPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildVizSeedSteps, {});
};

// 创建DONUT图表VizSeed Pipeline
export const createDonutVizSeedPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildVizSeedSteps, {});
};

// 创建TABLE图表VizSeed Pipeline
export const createTableVizSeedPipeline = () => {
  const buildVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildVizSeedSteps, {});
};