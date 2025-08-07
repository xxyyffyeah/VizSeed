/**
 * PIVOT_TABLE图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapPivotTable } from '../channelMapping/PivotTableMapping';

// 创建PIVOT_TABLE图表VizSeed Pipeline
export const createPivotTableVizSeedPipeline = () => {
  const buildPivotTableVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    mapPivotTable,
    vizSeedCleanupStep
  ];
  return pipeline(buildPivotTableVizSeedSteps, {});
};