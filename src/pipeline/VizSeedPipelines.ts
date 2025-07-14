/**
 * VizSeed构建Pipeline函数集合
 * 使用共享步骤避免重复代码
 */

import { pipeline, PipelineStep } from './PipelineCore';
import { chartAdapterStep } from './modules/vizSeed/ChartAdapterModule';
import { vizSeedInitStep } from './modules/vizSeed/VizSeedInitModule';
import { dataReshapeStep } from './modules/vizSeed/DataReshapeModule';
import { dataReshapeStep_1M1D1G } from './modules/vizSeed/dataReshape/DataReshapeModule_1M1D1G';
import { vizSeedCleanupStep } from './modules/vizSeed/VizSeedCleanupModule';
import { autoChannelMappingStep } from './modules/vizSeed/AutoChannelMappingModule';

// 创建BAR图表VizSeed Pipeline
export const createBarVizSeedPipeline = () => {
  const buildBarVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D1G,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildBarVizSeedSteps, {});
};

// 创建COLUMN图表VizSeed Pipeline
export const createColumnVizSeedPipeline = () => {
  const buildColumnVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D1G,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildColumnVizSeedSteps, {});
};

// 创建LINE图表VizSeed Pipeline
export const createLineVizSeedPipeline = () => {
  const buildLineVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D1G,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildLineVizSeedSteps, {});
};

// 创建AREA图表VizSeed Pipeline
export const createAreaVizSeedPipeline = () => {
  const buildAreaVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D1G,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildAreaVizSeedSteps, {});
};

// 创建SCATTER图表VizSeed Pipeline
export const createScatterVizSeedPipeline = () => {
  const buildScatterVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildScatterVizSeedSteps, {});
};

// 创建PIE图表VizSeed Pipeline
export const createPieVizSeedPipeline = () => {
  const buildPieVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D1G,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildPieVizSeedSteps, {});
};

// 创建DONUT图表VizSeed Pipeline
export const createDonutVizSeedPipeline = () => {
  const buildDonutVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D1G,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildDonutVizSeedSteps, {});
};

// 创建TABLE图表VizSeed Pipeline
export const createTableVizSeedPipeline = () => {
  const buildTableVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    autoChannelMappingStep,
    vizSeedCleanupStep
  ];
  return pipeline(buildTableVizSeedSteps, {});
};