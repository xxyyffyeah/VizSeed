/**
 * 表格行列映射策略
 * 功能：rowDimension通道使用第一个维度，columnDimension通道使用第二个维度，measure通道使用第一个指标
 * 适用于：表格、透视表等需要行列展示的图表
 */

import { ChannelMapping } from '../../../types/charts';
import { FieldSelection, PipelineStep } from '../../PipelineCore';

/**
 * 表格行列映射函数
 */
const mapTableRowColumnChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    rowDimension: dimensions[0],      // 行维度
    columnDimension: dimensions[1],   // 列维度
    measure: measures[0]              // 指标字段
  };
};

/**
 * 表格行列通道映射Pipeline步骤
 */
export const mapTableRowColumn: PipelineStep = (vizSeed: any, context: any) => {
  const { fieldSelection } = context;
  
  if (!fieldSelection || (fieldSelection.dimensions.length === 0 && fieldSelection.measures.length === 0)) {
    return vizSeed;
  }

  
  // 使用表格行列映射策略
  const autoMapping = mapTableRowColumnChannels(fieldSelection);
  
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