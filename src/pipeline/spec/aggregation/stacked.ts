
import { PipelineStep, PipelineContext } from '../../PipelineCore';

export const stacked: PipelineStep = (spec: any, context: PipelineContext) => {
  return {
    ...spec,
    stack: true,
  };
};