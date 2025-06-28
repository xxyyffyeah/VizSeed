import { ChartType, ChartSubType, ChartRequirement } from '../types/charts';

export class ChartRegistry {
  private static requirements: Map<ChartType, ChartRequirement> = new Map([
    ['bar', {
      minDimensions: 1,
      maxDimensions: 2,
      minMeasures: 1,
      maxMeasures: 3,
      supportedSubTypes: ['grouped', 'stacked', 'percent']
    }],
    ['column', {
      minDimensions: 1,
      maxDimensions: 2,
      minMeasures: 1,
      maxMeasures: 3,
      supportedSubTypes: ['grouped', 'stacked', 'percent']
    }],
    ['line', {
      minDimensions: 1,
      maxDimensions: 2,
      minMeasures: 1,
      maxMeasures: 5,
      supportedSubTypes: []
    }],
    ['area', {
      minDimensions: 1,
      maxDimensions: 2,
      minMeasures: 1,
      maxMeasures: 3,
      supportedSubTypes: ['stacked', 'percent']
    }],
    ['scatter', {
      minDimensions: 0,
      maxDimensions: 3,
      minMeasures: 2,
      maxMeasures: 4,
      supportedSubTypes: ['linear']
    }],
    ['pie', {
      minDimensions: 1,
      maxDimensions: 1,
      minMeasures: 1,
      maxMeasures: 1,
      supportedSubTypes: []
    }],
    ['donut', {
      minDimensions: 1,
      maxDimensions: 1,
      minMeasures: 1,
      maxMeasures: 1,
      supportedSubTypes: []
    }],
    ['table', {
      minDimensions: 0,
      maxDimensions: 10,
      minMeasures: 0,
      maxMeasures: 10,
      supportedSubTypes: []
    }]
  ]);

  public static getRequirement(chartType: ChartType): ChartRequirement | undefined {
    return this.requirements.get(chartType);
  }

  public static validate(
    chartType: ChartType, 
    subType: ChartSubType | undefined,
    dimensionCount: number, 
    measureCount: number
  ): { valid: boolean; errors: string[] } {
    const requirement = this.getRequirement(chartType);
    const errors: string[] = [];

    if (!requirement) {
      errors.push(`不支持的图表类型: ${chartType}`);
      return { valid: false, errors };
    }

    if (dimensionCount < requirement.minDimensions) {
      errors.push(`${chartType}图表至少需要 ${requirement.minDimensions} 个维度，当前有 ${dimensionCount} 个`);
    }

    if (dimensionCount > requirement.maxDimensions) {
      errors.push(`${chartType}图表最多支持 ${requirement.maxDimensions} 个维度，当前有 ${dimensionCount} 个`);
    }

    if (measureCount < requirement.minMeasures) {
      errors.push(`${chartType}图表至少需要 ${requirement.minMeasures} 个指标，当前有 ${measureCount} 个`);
    }

    if (measureCount > requirement.maxMeasures) {
      errors.push(`${chartType}图表最多支持 ${requirement.maxMeasures} 个指标，当前有 ${measureCount} 个`);
    }

    if (subType && requirement.supportedSubTypes && !requirement.supportedSubTypes.includes(subType)) {
      errors.push(`${chartType}图表不支持 ${subType} 子类型`);
    }

    return { valid: errors.length === 0, errors };
  }

  public static getSupportedSubTypes(chartType: ChartType): ChartSubType[] {
    const requirement = this.getRequirement(chartType);
    return requirement?.supportedSubTypes || [];
  }

  public static getAllChartTypes(): ChartType[] {
    return Array.from(this.requirements.keys());
  }
}