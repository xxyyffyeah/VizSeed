/**
 * 图表适配分析器
 * 分析图表类型对维度和指标的要求，并提供重塑策略建议
 */

import { PipelineStep, PipelineContext } from '../PipelineCore';
import { ChartType } from '../../types/charts';

// 图表数据结构要求
export interface ChartDataRequirement {
  chartType: ChartType;
  idealDimensions: number;      // 理想维度数量
  maxDimensions: number;        // 最大维度数量
  idealMeasures: number;        // 理想指标数量
  maxMeasures: number;          // 最大指标数量
  requiresReshape?: boolean;    // 是否强制需要重塑
  description: string;          // 描述
}

// 重塑策略
export interface ReshapeStrategy {
  action: 'elevate' | 'reduce' | 'none';
  reason: string;
  targetDimension?: string;     // 降维时的目标维度
  confidence: number;           // 策略置信度 (0-1)
}

// 分析结果
export interface ChartAnalysisResult {
  currentStructure: {
    dimensions: number;
    measures: number;
    dimensionNames: string[];
    measureNames: string[];
  };
  targetStructure: ChartDataRequirement;
  needsReshape: boolean;
  strategy: ReshapeStrategy;
}

// 图表类型数据要求配置
export const CHART_DATA_REQUIREMENTS: Record<ChartType, ChartDataRequirement> = {
  bar: {
    chartType: 'bar',
    idealDimensions: 1,
    maxDimensions: 2,
    idealMeasures: 1,
    maxMeasures: 3,
    description: '柱状图：1-2个维度，1-3个指标'
  },
  column: {
    chartType: 'column',
    idealDimensions: 1,
    maxDimensions: 2,
    idealMeasures: 1,
    maxMeasures: 3,
    description: '条形图：1-2个维度，1-3个指标'
  },
  line: {
    chartType: 'line',
    idealDimensions: 1,
    maxDimensions: 2,
    idealMeasures: 1,
    maxMeasures: 5,
    description: '折线图：1-2个维度，1-5个指标'
  },
  area: {
    chartType: 'area',
    idealDimensions: 1,
    maxDimensions: 2,
    idealMeasures: 1,
    maxMeasures: 3,
    description: '面积图：1-2个维度，1-3个指标'
  },
  scatter: {
    chartType: 'scatter',
    idealDimensions: 2,
    maxDimensions: 3,
    idealMeasures: 2,
    maxMeasures: 4,
    description: '散点图：2-3个维度，2-4个指标'
  },
  pie: {
    chartType: 'pie',
    idealDimensions: 1,
    maxDimensions: 1,
    idealMeasures: 1,
    maxMeasures: 1,
    requiresReshape: true,
    description: '饼图：必须1个维度，1个指标'
  },
  donut: {
    chartType: 'donut',
    idealDimensions: 1,
    maxDimensions: 1,
    idealMeasures: 1,
    maxMeasures: 1,
    requiresReshape: true,
    description: '环形图：必须1个维度，1个指标'
  },
  table: {
    chartType: 'table',
    idealDimensions: 0,
    maxDimensions: 10,
    idealMeasures: 0,
    maxMeasures: 10,
    description: '表格：任意维度和指标'
  }
};

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

  // 判断是否需要重塑
  const needsReshape = shouldReshapeForChart(chartType, dimensions.length, measures.length);
  
  // 生成重塑策略
  const strategy = generateReshapeStrategy(chartType, dimensions, measures, requirement);

  return {
    currentStructure,
    targetStructure: requirement,
    needsReshape,
    strategy
  };
};

// 判断图表是否需要重塑
const shouldReshapeForChart = (
  chartType: ChartType,
  dimensionCount: number,
  measureCount: number
): boolean => {
  const requirement = CHART_DATA_REQUIREMENTS[chartType];
  
  // 强制重塑的图表类型
  if (requirement.requiresReshape) {
    return dimensionCount !== requirement.idealDimensions || 
           measureCount !== requirement.idealMeasures;
  }
  
  // 超出最大限制时需要重塑
  return dimensionCount > requirement.maxDimensions || 
         measureCount > requirement.maxMeasures;
};

// 生成重塑策略
const generateReshapeStrategy = (
  chartType: ChartType,
  dimensions: string[],
  measures: string[],
  requirement: ChartDataRequirement
): ReshapeStrategy => {
  const dimCount = dimensions.length;
  const measureCount = measures.length;

  // 表格不需要重塑
  if (chartType === 'table') {
    return {
      action: 'none',
      reason: '表格支持任意维度和指标数量',
      confidence: 1.0
    };
  }

  // 饼图和环形图的特殊处理
  if (chartType === 'pie' || chartType === 'donut') {
    if (measureCount > 1) {
      return {
        action: 'elevate',
        reason: `${chartType === 'pie' ? '饼图' : '环形图'}需要单一指标，将${measureCount}个指标升维为指标名称维度`,
        confidence: 1.0
      };
    }
    if (dimCount > 1) {
      return {
        action: 'reduce',
        reason: `${chartType === 'pie' ? '饼图' : '环形图'}只能有1个维度，需要降维`,
        targetDimension: dimensions[1], // 选择第二个维度进行降维
        confidence: 0.8
      };
    }
  }

  // 维度过多时降维
  if (dimCount > requirement.maxDimensions) {
    return {
      action: 'reduce',
      reason: `${getChartTypeName(chartType)}维度数量过多(${dimCount} > ${requirement.maxDimensions})，建议降维`,
      targetDimension: dimensions[dimCount - 1], // 选择最后一个维度降维
      confidence: 0.7
    };
  }

  // 指标过多时升维
  if (measureCount > requirement.maxMeasures) {
    return {
      action: 'elevate',
      reason: `${getChartTypeName(chartType)}指标数量过多(${measureCount} > ${requirement.maxMeasures})，建议升维`,
      confidence: 0.8
    };
  }

  // 不需要重塑
  return {
    action: 'none',
    reason: '当前数据结构符合图表要求',
    confidence: 1.0
  };
};

// 获取图表类型中文名称
const getChartTypeName = (chartType: ChartType): string => {
  const names: Record<ChartType, string> = {
    bar: '柱状图',
    column: '条形图',
    line: '折线图',
    area: '面积图',
    scatter: '散点图',
    pie: '饼图',
    donut: '环形图',
    table: '表格'
  };
  return names[chartType] || chartType;
};

// 图表适配分析步骤
export const chartAdapterStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const { chartConfig, fieldSelection } = context;
  
  if (!chartConfig?.type || !fieldSelection) {
    return vizSeed;
  }

  // 分析图表要求
  const analysisResult = analyzeChartRequirements(
    chartConfig.type,
    fieldSelection.dimensions,
    fieldSelection.measures
  );

  // 将分析结果添加到vizSeed
  return {
    ...vizSeed,
    analysisResult,
    adaptationInfo: {
      needsReshape: analysisResult.needsReshape,
      strategy: analysisResult.strategy,
      currentStructure: analysisResult.currentStructure,
      targetStructure: analysisResult.targetStructure
    }
  };
};

