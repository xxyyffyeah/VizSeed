
import { PipelineStep, PipelineContext } from '../../PipelineCore';

export const barGrouped: PipelineStep = (spec: any, context: PipelineContext) => {
  const encodes = context.encodes[0] || {};
  return {
    ...spec,
    yField: [encodes.y, encodes.group],
  };
};

export const colGrouped: PipelineStep = (spec: any, context: PipelineContext) => {
  const encodes = context.encodes[0] || {};
  return {
    ...spec,
    xField: [encodes.x, encodes.group],
  };
};