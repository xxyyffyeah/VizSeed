/**
 * VizSeed初始化模块
 * 负责创建基础的VizSeed对象结构
 */

import { encode } from 'punycode';
import { PipelineStep, PipelineContext } from '../PipelineCore';

/**
 * VizSeed基础初始化步骤
 * 创建包含5个核心属性的VizSeed对象
 */
export const vizSeedInitStep: PipelineStep = (_vizSeed: any, context: PipelineContext) => {
  const { chartType, encodes, fieldMap, data, visualStyle} = context;
  
  return {
    chartType: chartType,
    data: data || [], // 初始为空
    fieldMap: fieldMap || {},
    encodes: encodes || {},
    visualStyle: visualStyle || {}
  };
};