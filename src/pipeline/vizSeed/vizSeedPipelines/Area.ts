/**
 * AREA图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { dataReshapeStep_1M1D1G } from '../dataReshape/DataReshapeModule_1M1D1G';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapTimeSeries } from '../channelMapping/TimeSeriesMapping';

// 创建AREA图表VizSeed Pipeline
export const createAreaVizSeedPipeline = () => {
  const buildAreaVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D1G,
    mapTimeSeries,
    vizSeedCleanupStep
  ];
  return pipeline(buildAreaVizSeedSteps, {});
};