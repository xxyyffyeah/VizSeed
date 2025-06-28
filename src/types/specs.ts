export interface VTableSpec {
  type: 'table';
  data: {
    values: Record<string, any>[];
  };
  columns: Array<{
    field: string;
    title?: string;
    width?: number;
    cellType?: 'text' | 'number' | 'date';
    format?: string;
  }>;
  theme?: string;
  pagination?: {
    perPageCount?: number;
    currentPage?: number;
  };
}

export interface VChartSpec {
  type: string;
  data: {
    values: Record<string, any>[];
  };
  xField?: string;
  yField?: string;
  colorField?: string;
  sizeField?: string;
  shapeField?: string;
  seriesField?: string;
  
  axes?: Array<{
    orient: 'left' | 'right' | 'top' | 'bottom';
    type?: 'linear' | 'band' | 'time';
    title?: {
      visible?: boolean;
      text?: string;
    };
  }>;
  
  legends?: Array<{
    visible?: boolean;
    orient?: 'left' | 'right' | 'top' | 'bottom';
    title?: {
      visible?: boolean;
      text?: string;
    };
  }>;
  
  title?: {
    visible?: boolean;
    text?: string;
  };
  
  theme?: string;
  width?: number;
  height?: number;
}