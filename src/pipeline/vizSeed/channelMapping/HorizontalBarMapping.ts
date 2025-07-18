/**
 * 水平条形图映射策略
 * 功能：x通道使用第一个指标，y通道使用第一个维度，group通道使用第二个维度
 * 适用于：柱状图、条形图等需要横向展示数据的图表
 */

import { ChannelMapping } from '../../../types/charts';
import { FieldSelection, PipelineStep } from '../../PipelineCore';

/**
 * 水平条形图映射函数
 */
const mapHorizontalBarChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    x: measures[0],     // X轴使用第一个指标
    y: dimensions[0],   // Y轴使用第一个维度
    group: dimensions[1]  // 分组使用第二个维度（如果有）
  };
};

/**
 * 水平条形图通道映射Pipeline步骤
 */
export const mapHorizontalBar: PipelineStep = (vizSeed: any, context: any) => {
  const { fieldSelection } = context;
  
  if (!fieldSelection || (fieldSelection.dimensions.length === 0 && fieldSelection.measures.length === 0)) {
    return vizSeed;
  }

  console.log(`🎨 水平条形图自动通道映射，字段选择:`, fieldSelection);
  
  // 使用水平条形图映射策略
  const autoMapping = mapHorizontalBarChannels(fieldSelection);
  
  // 过滤掉undefined的值
  const filteredMapping: any = {};
  Object.entries(autoMapping).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      (filteredMapping as any)[key] = value;
    }
  });
  
  console.log(`🔗 水平条形图通道映射结果:`, filteredMapping);
  
  // 更新context和vizSeed
  const updatedEncodes = [filteredMapping];
  context.encodes = updatedEncodes;
  
  return {
    ...vizSeed,
    encodes: updatedEncodes
  };
};