/**
 * 配置验证模块
 * 在Pipeline最后阶段验证图表配置的完整性和正确性
 */

import { PipelineStep, PipelineContext } from '../PipelineCore';
import { ChartType, ChannelMapping, CHART_REQUIREMENTS } from '../../types/charts';

/**
 * 验证图表配置
 */
export const validateChartConfig = (
  chartType: ChartType,
  mapping: ChannelMapping
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // 获取图表类型要求
  const requirement = CHART_REQUIREMENTS[chartType];
  if (!requirement) {
    errors.push(`不支持的图表类型: ${chartType}`);
    return { isValid: false, errors };
  }
  
  // 检查必需字段
  for (const requiredChannel of requirement.required) {
    if (!mapping[requiredChannel as keyof ChannelMapping]) {
      errors.push(`图表类型 ${chartType} 缺少必需的通道: ${requiredChannel}`);
    }
  }
  
  // 自定义验证
  if (requirement.validation && !requirement.validation(mapping)) {
    errors.push(`图表类型 ${chartType} 的通道配置验证失败`);
  }
  
  // 检查最少字段数
  const setChannels = Object.values(mapping).filter(v => v).length;
  if (setChannels < requirement.minFields) {
    errors.push(`图表类型 ${chartType} 至少需要 ${requirement.minFields} 个字段，当前只有 ${setChannels} 个`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 配置验证Pipeline步骤
 */
export const configValidationStep: PipelineStep = (vizSeed: any, context: PipelineContext) => {
  const chartType = vizSeed.chartType;
  const mapping = vizSeed.chartConfig?.mapping || {};
  
  if (!chartType) {
    throw new Error('图表类型未设置');
  }
  
  console.log(`🔍 配置验证: 图表类型=${chartType}, 通道映射=`, mapping);
  
  // 执行验证
  const validation = validateChartConfig(chartType, mapping);
  
  if (!validation.isValid) {
    const errorMessage = validation.errors.join('; ');
    console.error(`❌ 配置验证失败:`, validation.errors);
    throw new Error(`配置验证失败: ${errorMessage}`);
  }
  
  console.log(`✅ 配置验证通过`);
  
  return {
    ...vizSeed,
    validationInfo: {
      isValid: true,
      chartType,
      mapping,
      validatedAt: new Date().toISOString()
    }
  };
};