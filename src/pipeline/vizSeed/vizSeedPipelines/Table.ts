/**
 * TABLE图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { dataReshapeStep } from '../DataReshapeModule';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapTableColumn } from '../channelMapping/TableColumnMapping';

// 创建TABLE图表VizSeed Pipeline
export const createTableVizSeedPipeline = () => {
  const buildTableVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    mapTableColumn,
    vizSeedCleanupStep
  ];
  return pipeline(buildTableVizSeedSteps, {});
};