/**
 * PIE图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { dataReshapeStep } from '../DataReshapeModule';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapCategoryValue } from '../channelMapping/CategoryValueMapping';

// 创建PIE图表VizSeed Pipeline
export const createPieVizSeedPipeline = () => {
  const buildPieVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    mapCategoryValue,
    vizSeedCleanupStep
  ];
  return pipeline(buildPieVizSeedSteps, {});
};