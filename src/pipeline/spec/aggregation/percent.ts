
import { PipelineStep, PipelineContext } from '../../PipelineCore';

export const percent: PipelineStep = (spec: any, context: PipelineContext) => {
  return {
    ...spec,
    stack: true,
    percent: true, // 添加百分比聚合
  };
};