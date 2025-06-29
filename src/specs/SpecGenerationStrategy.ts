import { VizSeedDSL } from '../core/VizSeedDSL';
import { ChartSpec, ChartLibrary } from '../types/specs';
import { ChartType } from '../types/charts';

export interface SpecGenerationStrategy {
  getLibraryName(): ChartLibrary;
  generateSpec(vizSeed: VizSeedDSL): ChartSpec;
  getSupportedChartTypes(): ChartType[];
}