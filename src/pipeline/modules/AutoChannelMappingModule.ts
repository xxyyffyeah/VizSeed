/**
 * 自动通道映射模块
 * 根据重塑后的fieldSelection自动创建chartConfig.mapping
 */

import { PipelineStep, PipelineContext, FieldSelection, PipelineStepResult } from '../PipelineCore';
import { ChartType, ChannelMapping } from '../../types/charts';

// 通道映射策略接口
interface ChannelMappingStrategy {
  mapChannels: (fieldSelection: FieldSelection) => ChannelMapping;
  description: string;
}

/**
 * 饼图和环形图的通道映射策略
 */
const mapPieChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    category: dimensions[0] || '__MeasureName__',  // 第一个维度，或升维后的指标名称
    value: measures[0] || '__MeasureValue__'       // 第一个指标，或升维后的指标值
  };
};

/**
 * 柱状图和条形图的通道映射策略
 */
const mapBarChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    x: dimensions[0],     // X轴使用第一个维度
    y: measures[0],       // Y轴使用第一个指标
    color: dimensions[1]  // 颜色使用第二个维度（如果有）
  };
};

/**
 * 折线图和面积图的通道映射策略
 */
const mapLineChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    x: dimensions[0],     // X轴使用第一个维度（通常是时间序列）
    y: measures[0],       // Y轴使用第一个指标
    color: dimensions[1] || (measures.length > 1 ? '__MeasureName__' : undefined)  // 多系列支持
  };
};

/**
 * 散点图的通道映射策略
 */
const mapScatterChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    x: measures[0],       // X轴使用第一个指标
    y: measures[1],       // Y轴使用第二个指标
    color: dimensions[0]  // 颜色使用第一个维度
  };
};

/**
 * 表格的通道映射策略
 */
const mapTableChannels = (fieldSelection: FieldSelection): ChannelMapping => {
  const { dimensions, measures } = fieldSelection;
  
  return {
    rowDimension: dimensions[0],      // 行维度
    columnDimension: dimensions[1],   // 列维度
    measure: measures[0]              // 指标字段
  };
};

// 图表类型到映射策略的映射
const CHANNEL_MAPPING_STRATEGIES: Record<ChartType, ChannelMappingStrategy> = {
  pie: {
    mapChannels: mapPieChannels,
    description: '饼图: category(维度) + value(指标)'
  },
  donut: {
    mapChannels: mapPieChannels,
    description: '环形图: category(维度) + value(指标)'
  },
  bar: {
    mapChannels: mapBarChannels,
    description: '柱状图: x(维度) + y(指标) + color(可选维度)'
  },
  column: {
    mapChannels: mapBarChannels,
    description: '条形图: x(维度) + y(指标) + color(可选维度)'
  },
  line: {
    mapChannels: mapLineChannels,
    description: '折线图: x(维度) + y(指标) + color(可选)'
  },
  area: {
    mapChannels: mapLineChannels,
    description: '面积图: x(维度) + y(指标) + color(可选)'
  },
  scatter: {
    mapChannels: mapScatterChannels,
    description: '散点图: x(指标) + y(指标) + color(可选维度)'
  },
  table: {
    mapChannels: mapTableChannels,
    description: '表格: rowDimension + columnDimension + measure'
  }
};

/**
 * 智能生成通道映射
 */
export const generateAutoChannelMapping = (
  chartType: ChartType,
  fieldSelection: FieldSelection
): ChannelMapping => {
  const strategy = CHANNEL_MAPPING_STRATEGIES[chartType];
  
  if (!strategy) {
    console.warn(`⚠️ 未找到图表类型 ${chartType} 的通道映射策略`);
    return {};
  }
  
  const mapping = strategy.mapChannels(fieldSelection);
  
  // 过滤掉undefined的值
  const filteredMapping: ChannelMapping = {};
  Object.entries(mapping).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      (filteredMapping as any)[key] = value;
    }
  });
  
  console.log(`🎨 自动通道映射 (${strategy.description}):`, filteredMapping);
  
  return filteredMapping;
};

/**
 * 检查用户是否已设置完整的通道映射
 */
const hasCompleteUserMapping = (mapping: ChannelMapping, chartType: ChartType): boolean => {
  const strategy = CHANNEL_MAPPING_STRATEGIES[chartType];
  if (!strategy) return false;
  
  // 生成预期的完整映射
  const expectedMapping = strategy.mapChannels({ dimensions: [], measures: [] });
  const expectedChannels = Object.keys(expectedMapping);
  
  // 检查是否所有必需通道都已设置
  return expectedChannels.every(channel => 
    mapping[channel as keyof ChannelMapping] !== undefined && 
    mapping[channel as keyof ChannelMapping] !== null
  );
};

/**
 * 自动通道映射Pipeline步骤
 */
export const autoChannelMappingStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const { chartConfig, fieldSelection } = context;
  
  // 必须有图表类型和字段选择
  if (!chartConfig?.type || !fieldSelection) {
    return vizSeed;
  }

  // 获取当前的映射配置
  const currentMapping = chartConfig.mapping || {};
  
  // 如果用户已经设置了完整的通道映射，跳过自动映射
  if (hasCompleteUserMapping(currentMapping, chartConfig.type)) {
    console.log(`👤 用户已设置完整通道映射，跳过自动映射`);
    return vizSeed;
  }

  // 检查fieldSelection是否为空
  if (fieldSelection.dimensions.length === 0 && fieldSelection.measures.length === 0) {
    console.log(`⚠️ fieldSelection为空，跳过自动通道映射`);
    return vizSeed;
  }

  console.log(`🤖 自动通道映射: 图表类型为 ${chartConfig.type}，字段选择:`, fieldSelection);
  
  // 生成自动通道映射
  const autoMapping = generateAutoChannelMapping(chartConfig.type, fieldSelection);
  
  // 合并用户设置的映射和自动生成的映射（用户设置优先）
  const mergedMapping = { ...autoMapping, ...currentMapping };
  
  console.log(`🔗 合并后的通道映射:`, mergedMapping);
  
  // 更新context中的chartConfig
  const updatedChartConfig = {
    ...chartConfig,
    mapping: mergedMapping
  };

  const updatedContext = {
    ...context,
    chartConfig: updatedChartConfig
  };

  return {
    result: {
      ...vizSeed,
      chartConfig: updatedChartConfig,
      autoChannelMapping: autoMapping
    },
    context: updatedContext
  };
};