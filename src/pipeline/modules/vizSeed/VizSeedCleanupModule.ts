/**
 * VizSeed清理模块
 * 负责最终清理，确保只保留5个核心属性
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

/**
 * VizSeed最终清理步骤
 * 只保留5个核心属性：chartType、dataMap、fieldMap、chartConfig、visualStyle
 */
export const vizSeedCleanupStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const { visualStyle } = context;
  
  return {
    chartType: vizSeed.chartType,
    dataMap: vizSeed.dataMap,
    fieldMap: vizSeed.fieldMap,
    chartConfig: vizSeed.chartConfig,
    visualStyle: {
      title: visualStyle?.title,
      legend: visualStyle?.legend !== false,
      label: visualStyle?.label !== false,
      tooltip: visualStyle?.tooltip !== false
    }
  };
};