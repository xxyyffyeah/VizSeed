/**
 * TABLE图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { dataReshapeStep } from '../DataReshapeModule';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { autoChannelMappingStep } from '../AutoChannelMappingModule';

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