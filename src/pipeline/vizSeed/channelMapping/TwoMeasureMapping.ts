/**
 * 双指标映射策略
 * 功能：x通道使用第一个指标，y通道使用第二个指标，color通道使用第一个维度
 * 适用于：散点图等需要比较两个指标关系的图表
 */

import { ChannelMapping } from '../../../types/charts';
import { FieldSelection, PipelineStep } from '../../PipelineCore';

/**
 * 双指标映射函数
 */
const mapTwoMeasuresChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    x: measures[0],       // X轴使用第一个指标
    y: measures[1],       // Y轴使用第二个指标
    color: dimensions[0]  // 颜色使用第一个维度
  };
};

/**
 * 双指标通道映射Pipeline步骤
 */
export const mapTwoMeasures: PipelineStep = (vizSeed: any, context: any) => {
  const { fieldSelection } = context;
  
  if (!fieldSelection || (fieldSelection.dimensions.length === 0 && fieldSelection.measures.length === 0)) {
    return vizSeed;
  }

  console.log(`🎨 双指标自动通道映射，字段选择:`, fieldSelection);
  
  // 使用双指标映射策略
  const autoMapping = mapTwoMeasuresChannels(fieldSelection);
  
  // 过滤掉undefined的值
  const filteredMapping: any = {};
  Object.entries(autoMapping).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      (filteredMapping as any)[key] = value;
    }
  });
  
  console.log(`🔗 双指标通道映射结果:`, filteredMapping);
  
  // 更新context和vizSeed
  const updatedEncodes = [filteredMapping];
  context.encodes = updatedEncodes;
  
  return {
    ...vizSeed,
    encodes: updatedEncodes
  };
};