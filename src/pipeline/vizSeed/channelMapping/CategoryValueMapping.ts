/**
 * 类别-数值映射策略
 * 功能：category通道使用第一个维度，value通道使用第一个指标
 * 适用于：饼图、环形图等需要分类展示数值的图表
 */

import { ChannelMapping } from '../../../types/charts';
import { FieldSelection, PipelineStep } from '../../PipelineCore';

/**
 * 类别-数值映射函数
 */
const mapCategoryValueChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    category: dimensions[0] || '__MeasureName__',  // 第一个维度，或升维后的指标名称
    value: measures[0] || '__MeasureValue__'       // 第一个指标，或升维后的指标值
  };
};

/**
 * 类别-数值通道映射Pipeline步骤
 */
export const mapCategoryValue: PipelineStep = (vizSeed: any, context: any) => {
  const { fieldSelection } = context;
  
  if (!fieldSelection || (fieldSelection.dimensions.length === 0 && fieldSelection.measures.length === 0)) {
    return vizSeed;
  }
  
  // 使用类别-数值映射策略
  const autoMapping = mapCategoryValueChannels(fieldSelection);
  
  // 过滤掉undefined的值
  const filteredMapping: any = {};
  Object.entries(autoMapping).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      (filteredMapping as any)[key] = value;
    }
  });
  
  // 更新context和vizSeed
  const updatedEncodes = [filteredMapping];
  context.encodes = updatedEncodes;
  
  return {
    ...vizSeed,
    encodes: updatedEncodes
  };
};