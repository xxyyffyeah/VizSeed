/**
 * VTable表格初始化模块
 */

import { PipelineStep, PipelineContext } from '../../PipelineCore';

// VTable表格初始化
export const initVTableList: PipelineStep = (spec: any, context: PipelineContext) => {
  const { data } = context;
  
  // // 根据数据字段生成列配置
  // const columns: any[] = [];
  // if (data?.fields) {
  //   data.fields.forEach((field: any) => {
  //     if (field.name && !field.name.startsWith('__')) { // 排除内部字段
  //       columns.push({
  //         field: field.name,
  //         title: field.alias || field.name,
  //         width: 120
  //       });
  //     }
  //   });
  // }

  return {
    ...spec,
    type: 'list-table',
    // columns,
    records: data || []
  };
};