/**
 * VizSeed清理模块
 * 负责最终清理，确保只保留5个核心属性
 */

import { theme } from '@visactor/vtable/es/register';
import { PipelineStep, PipelineContext } from '../../PipelineCore';

/**
 * VizSeed最终清理步骤
 * en
 */
export const vizSeedCleanupStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const { visualStyle } = context;
  
  return {
    chartType: context.chartType,
    data: context.data,
    fieldMap: context.fieldMap,
    encodes: context.encodes,
    style: {
      title: visualStyle?.title,
      legend: visualStyle?.legend !== false,
      label: visualStyle?.label !== false,
      tooltip: visualStyle?.tooltip !== false
    },
    dimensions: context.fieldSelection?.dimensions || [],
    measures: context.fieldSelection?.measures || [],
    rowDimensions: [],
    columnDimensions: [],
    theme: context.theme,
  };
};