/**
 * 图表适配分析器
 * 分析图表类型对维度和指标的要求，并提供重塑策略建议
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';
import { ChartType, ChartDataRequirement, CHART_DATA_REQUIREMENTS } from '../../../types/charts';

// 分析结果
export interface ChartAnalysisResult {
  currentStructure: {
    dimensions: number;
    measures: number;
    dimensionNames: string[];
    measureNames: string[];
  };
  targetStructure: ChartDataRequirement;
}



// 分析图表数据要求
export const analyzeChartRequirements = (
  chartType: ChartType,
  dimensions: string[],
  measures: string[]
): ChartAnalysisResult => {
  const requirement = CHART_DATA_REQUIREMENTS[chartType];
  
  const currentStructure = {
    dimensions: dimensions.length,
    measures: measures.length,
    dimensionNames: dimensions,
    measureNames: measures
  };

  return {
    currentStructure,
    targetStructure: requirement
  };
};

// 图表适配分析步骤
export const chartAdapterStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const { chartConfig, fieldSelection } = context;
  

  // 分析图表要求
  const analysisResult = analyzeChartRequirements(
    chartConfig.type,
    fieldSelection.dimensions,
    fieldSelection.measures
  );

  // 将分析结果添加到vizSeed
  return {
    ...vizSeed,
    analysisResult
  };
};

