/**
 * 给Line和Area配置Sort来正确显示
 */

import { series, sort } from 'radash';
import { PipelineStep, PipelineContext } from '../../PipelineCore';

// X轴排序配置步骤
export const SortXAxis: PipelineStep = (spec: any, _context: PipelineContext) => {
  // 如果没有data或xField，直接返回
  if (!spec.data || !spec.xField || !Array.isArray(spec.data)) {
    return spec;
  }

  // 获取xField名称
  const xFieldName = spec.xField;
  const seriesFieldName = spec.seriesField;
  
  // 修改data数组，给每个数据源添加fields配置
  const updatedData = spec.data.map((dataSource: any) => {
    return {
      ...dataSource,
      fields: {
        ...dataSource.fields,
        [xFieldName]: {
          sortIndex: 0
        },
        [seriesFieldName]: {
          sortIndex: 1
        }
      }
    };
  });

  return {
    ...spec,
    data: updatedData,
  };
};