/**
 * VizSeed清理模块
 * 负责最终清理，确保只保留5个核心属性
 */

import { theme } from '@visactor/vtable/es/register';
import { PipelineStep, PipelineContext } from '../PipelineCore';
import { version } from 'os';
import { c } from 'vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf';

/**
 * VizSeed最终清理步骤
 * en
 */
export const vizSeedCleanupStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  
  return {
    chartType: context.chartType,
    data: context.data,
    fieldMap: context.fieldMap,
    encodes: context.encodes,
    style: context.visualStyle,
    dimensions: context.fieldSelection?.dimensions,
    measures: context.fieldSelection?.measures,
    rowDimensions: context.fieldSelection?.rowDimensions,
    columnDimensions: context.fieldSelection?.columnDimensions,
    indicatorChartSpecs: context.fieldSelection?.indicatorChartSpecs || {},
    theme: context.theme,
    version: context.version
  };
};