/**
 * 数据重塑模块 - 使用Pipeline子模块实现维度重塑
 * 基于fieldMap和图表要求，在pipeline中修改数据结构
 */

import { PipelineStep, PipelineContext, FieldSelection } from '../../PipelineCore';
import { CHART_DATA_REQUIREMENTS } from '../../../types/charts';
import { elevateStep, reduceStep } from './utils/ElevateAndReduce';

// 重塑结果接口
export interface DataReshapeResult {
  reshapeType: 'elevate' | 'reduce' | 'composite' | 'none';
  reshapeInfo?: {
    strategy: string;
    steps: string[];
    operations: any[];
  };
}

// 获取字段选择的辅助函数（仅本模块使用）
const getFieldSelection = (context: PipelineContext): FieldSelection => {
  return context.fieldSelection || { dimensions: [], measures: [] };
};

// elevateStep 和 reduceStep 已从 './utils/ElevateAndReduce' 导入

/**
 * 数据重塑Pipeline步骤 - 使用子模块实现智能重塑
 */
export const dataReshapeStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const { data, chartConfig ,fieldSelection} = context;
  
  if (!data?.rows || !chartConfig?.type) {
    return vizSeed;
  }

  // 初始化dataMap（如果为空）
  if (!context.dataMap || context.dataMap.length === 0) {
    context.dataMap = [...data.rows];
  }
  
  // 获取图表要求
  const requirement = CHART_DATA_REQUIREMENTS[chartConfig.type as keyof typeof CHART_DATA_REQUIREMENTS];
  
  if (!requirement) {
    return {
      ...vizSeed,
      dataMap: context.dataMap,
      reshapeInfo: {
        reshapeType: 'none',
        reason: '未找到图表类型的数据要求'
      }
    };
  }

  let currentDims = fieldSelection.dimensions.length;
  let currentMeas = fieldSelection.measures.length;
  const targetDims = requirement.idealDimensions;
  const targetMeas = requirement.idealMeasures;
  
  // 如果当前结构已经符合要求
  if (currentDims === targetDims && currentMeas === targetMeas) {
    return {
      ...vizSeed,
      dataMap: context.dataMap,
      reshapeInfo: {
        reshapeType: 'none'
      }
    };
  }

  const operations: string[] = [];

  // 步骤1: 如果维度过多，使用降维子模块
  if (currentDims > targetDims) {
    let currentFieldSelection = getFieldSelection(context);
    
    // 多次降维直到达到目标维度数
    while (currentFieldSelection.dimensions.length > targetDims) {
      const beforeLength = currentFieldSelection.dimensions.length;
      vizSeed = reduceStep(vizSeed, context);
      
      // 检查是否实际进行了降维
      const afterFieldSelection = getFieldSelection(context);
      if (afterFieldSelection.dimensions.length >= beforeLength) {
        break; // 防止无限循环
      }
      
      currentFieldSelection = afterFieldSelection;
      operations.push('reduce');
    }
  }

  // 步骤2: 如果指标过多，使用升维子模块
  const finalFieldSelection = getFieldSelection(context);
  if (finalFieldSelection.measures.length > targetMeas) {
    vizSeed = elevateStep(vizSeed, context);
    operations.push('elevate');
  }

  // 设置重塑信息
  const finalReshapeType = operations.length === 1 ? 
    (operations[0] as 'elevate' | 'reduce') : 
    (operations.length > 1 ? 'composite' : 'none');

  return {
    ...vizSeed,
    dataMap: context.dataMap,
    reshapeInfo: {
      strategy: `${currentDims}维度${currentMeas}指标 → ${targetDims}维度${targetMeas}指标`,
      steps: operations,
      reshapeType: finalReshapeType
    }
  };
};

