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
      width: 120,
      cellType: 'text' // VTable默认使用text类型
    }));

    return {
      records: data.rows,
      columns: columns,
      theme: metadata?.theme || 'default',
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