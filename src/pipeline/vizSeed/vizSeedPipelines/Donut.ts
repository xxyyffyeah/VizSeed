/**
 * DONUT图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapCategoryValue } from '../channelMapping/CategoryValueMapping';
import { dataReshapeStep_1M1D } from '../dataReshape/DataReshapeModule_1M1D';

// 创建DONUT图表VizSeed Pipeline
export const createDonutVizSeedPipeline = () => {
  const buildDonutVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D,
    mapCategoryValue,
    vizSeedCleanupStep
  ];
  return pipeline(buildDonutVizSeedSteps, {});
};