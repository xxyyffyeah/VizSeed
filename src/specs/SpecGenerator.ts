import { VizSeedDSL } from '../core/VizSeedDSL';
import { ChartSpec, ChartLibrary } from '../types/specs';
import { ChartType } from '../types/charts';
import { SpecGenerationStrategy } from './SpecGenerationStrategy';
import { VChartStrategy } from './VChartStrategy';
import { VTableStrategy } from './VTableStrategy';
import { EChartsStrategy } from './EChartsStrategy';

export class SpecGenerator {
  private strategies: Map<ChartLibrary, SpecGenerationStrategy>;
  private currentStrategy: SpecGenerationStrategy | null = null;

  constructor() {
    this.strategies = new Map();
    this.registerStrategies();
  }

  private registerStrategies() {
    const vchartStrategy = new VChartStrategy();
    const vtableStrategy = new VTableStrategy();
    const echartsStrategy = new EChartsStrategy();

    this.strategies.set(vchartStrategy.getLibraryName(), vchartStrategy);
    this.strategies.set(vtableStrategy.getLibraryName(), vtableStrategy);
    this.strategies.set(echartsStrategy.getLibraryName(), echartsStrategy);
  }

  public setStrategy(library: ChartLibrary): void {
    const strategy = this.strategies.get(library);
    if (!strategy) {
      throw new Error(`Unsupported chart library: ${library}`);
    }
    this.currentStrategy = strategy;
  }

  public generate(vizSeed: VizSeedDSL, library: ChartLibrary): ChartSpec {
    this.setStrategy(library);
    
    if (!this.currentStrategy) {
      throw new Error('No strategy set');
    }

    // 检查图表类型是否被支持
    const supportedTypes = this.currentStrategy.getSupportedChartTypes();
    if (!supportedTypes.includes(vizSeed.chartConfig.type)) {
      throw new Error(
        `Chart type '${vizSeed.chartConfig.type}' is not supported by ${library}. ` +
        `Supported types: ${supportedTypes.join(', ')}`
      );
    }

    return this.currentStrategy.generateSpec(vizSeed);
  }

  public getSupportedLibraries(): ChartLibrary[] {
    return Array.from(this.strategies.keys());
  }

  public getSupportedChartTypes(library: ChartLibrary): ChartType[] {
    const strategy = this.strategies.get(library);
    if (!strategy) {
      throw new Error(`Unsupported chart library: ${library}`);
    }
    return strategy.getSupportedChartTypes();
  }

  public getAllSupportedChartTypes(): Record<ChartLibrary, ChartType[]> {
    const result: Record<ChartLibrary, ChartType[]> = {} as Record<ChartLibrary, ChartType[]>;
    
    for (const [library, strategy] of this.strategies) {
      result[library] = strategy.getSupportedChartTypes();
    }
    
    return result;
  }
}