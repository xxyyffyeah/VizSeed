import { VizSeedDSL } from '../core/VizSeedDSL';
import { VTableSpec, ChartLibrary } from '../types/specs';
import { ChartType } from '../types/charts';
import { SpecGenerationStrategy } from './SpecGenerationStrategy';

export class VTableStrategy implements SpecGenerationStrategy {
  getLibraryName(): ChartLibrary {
    return 'vtable';
  }

  getSupportedChartTypes(): ChartType[] {
    return ['table'];
  }

  generateSpec(vizSeed: VizSeedDSL): VTableSpec {
    const { data, metadata } = vizSeed;
    
    const columns = data.fields.map(field => ({
      field: field.name,
      title: field.name,
      cellType: this.mapFieldTypeToColumnType(field.type)
    }));

    return {
      type: 'table',
      data: {
        values: data.rows
      },
      columns: columns,
      theme: metadata?.theme,
      pagination: {
        perPageCount: 20,
        currentPage: 1
      }
    };
  }

  private mapFieldTypeToColumnType(fieldType: string): 'text' | 'number' | 'date' {
    switch (fieldType) {
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  }
}