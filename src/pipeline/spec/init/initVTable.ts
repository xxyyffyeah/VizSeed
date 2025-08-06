/**
 * VTable表格初始化模块
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VTable表格初始化
export const initVTableList: PipelineStep = (spec: any, context: PipelineContext) => {
  const { encodes, data } = context;
  
  // 根据encodes构造列配置
  const columns: any[] = [];
  if (encodes && encodes.length > 0) {
    const encode = encodes[0];
    
    // 处理维度字段（columnDimension是字符串数组）
    if (encode.columnDimension && Array.isArray(encode.columnDimension)) {
      encode.columnDimension.forEach((fieldName: string) => {
        if (fieldName && !fieldName.startsWith('__')) { // 排除内部字段
          columns.push({
            field: fieldName,
            title: fieldName,
            width: 'auto',
            cellType: 'text'
          });
        }
      });
    }
    
    // 处理指标字段（measure是字符串数组）
    if (encode.measure && Array.isArray(encode.measure)) {
      encode.measure.forEach((fieldName: string) => {
        if (fieldName && !fieldName.startsWith('__')) {
          columns.push({
            field: fieldName,
            title: fieldName,
            width: 'auto',
            cellType: 'text',
            style: {
              textAlign: 'right'  // 数值字段右对齐
            }
          });
        }
      });
    }
  }

  return {
    ...spec,
    columns,  // 启用列配置
    records: data || []
  };
};