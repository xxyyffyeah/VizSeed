/**
 * COLUMN图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { dataReshapeStep_1M1D1G } from '../dataReshape/DataReshapeModule_1M1D1G';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapVerticalColumn } from '../channelMapping/VerticalColumnMapping';

// 创建COLUMN图表VizSeed Pipeline
export const createColumnVizSeedPipeline = () => {
  const buildColumnVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    dataReshapeStep_1M1D1G,
    mapVerticalColumn,
    vizSeedCleanupStep
  ];
  return pipeline(buildColumnVizSeedSteps, {});
};