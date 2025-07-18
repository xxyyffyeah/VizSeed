/**
 * SCATTER图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { dataReshapeStep } from '../DataReshapeModule';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapTwoMeasures } from '../channelMapping/TwoMeasureMapping';

// 创建SCATTER图表VizSeed Pipeline
export const createScatterVizSeedPipeline = () => {
  const buildScatterVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    mapTwoMeasures,
    vizSeedCleanupStep
  ];
  return pipeline(buildScatterVizSeedSteps, {});
};