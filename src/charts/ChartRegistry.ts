import { ChartType, ChartRequirement, CHART_REQUIREMENTS, ChannelMapping } from '../types/charts';

export class ChartRegistry {
  private static requirements: Map<ChartType, ChartRequirement> = new Map(
    Object.entries(CHART_REQUIREMENTS) as [ChartType, ChartRequirement][]
  );

  public static getRequirement(chartType: ChartType): ChartRequirement | undefined {
    return this.requirements.get(chartType);
  }

  public static validate(
    chartType: ChartType,
    mapping: ChannelMapping
  ): { valid: boolean; errors: string[] } {
    const requirement = this.getRequirement(chartType);
    const errors: string[] = [];

    if (!requirement) {
      errors.push(`不支持的图表类型: ${chartType}`);
      return { valid: false, errors };
    }

    // 检查必需字段
    for (const requiredChannel of requirement.required) {
      if (!mapping[requiredChannel as keyof ChannelMapping]) {
        errors.push(`${chartType}图表缺少必需的通道: ${requiredChannel}`);
      }
    }

    // 自定义验证
    if (requirement.validation && !requirement.validation(mapping)) {
      errors.push(`${chartType}图表的通道配置验证失败`);
    }

    // 检查最少字段数
    const setChannels = Object.values(mapping).filter(v => v).length;
    if (setChannels < requirement.minFields) {
      errors.push(`${chartType}图表至少需要 ${requirement.minFields} 个字段，当前只有 ${setChannels} 个`);
    }

    return { valid: errors.length === 0, errors };
  }


  public static getAllChartTypes(): ChartType[] {
    return Array.from(this.requirements.keys());
  }
}