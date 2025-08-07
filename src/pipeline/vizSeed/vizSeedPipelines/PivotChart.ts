/**
 * PIVOT_CHART图表VizSeed Pipeline
 */

import { pipeline, PipelineStep } from '../../PipelineCore';
import { chartAdapterStep } from '../ChartAdapterModule';
import { vizSeedInitStep } from '../VizSeedInitModule';
import { vizSeedCleanupStep } from '../VizSeedCleanupModule';
import { mapPivotTable } from '../channelMapping/PivotTableMapping';

// 创建PIVOT_CHART图表VizSeed Pipeline
export const createPivotChartVizSeedPipeline = () => {
  const buildPivotChartVizSeedSteps: PipelineStep[] = [
    vizSeedInitStep,
    chartAdapterStep,
    mapPivotTable,  // 重用PivotTable的映射逻辑，因为都需要行列维度
    vizSeedCleanupStep
  ];
  return pipeline(buildPivotChartVizSeedSteps, {});
};