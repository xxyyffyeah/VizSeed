/**
 * DONUT图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { dataReshapeStep } from '../DataReshapeModule';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapCategoryValue } from '../channelMapping/CategoryValueMapping';

// 创建DONUT图表VizSeed Pipeline
export const createDonutVizSeedPipeline = () => {
  const buildDonutVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep,
    mapCategoryValue,
    vizSeedCleanupStep
  ];
  return pipeline(buildDonutVizSeedSteps, {});
};