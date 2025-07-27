
import { PipelineStep, PipelineContext } from '../../PipelineCore';

// 数据初始化步骤
export const configResponsive: PipelineStep = (spec: any, context: PipelineContext) => {
  const { visualStyle } = context;

  // return {
  //   ...spec,
  //   widthMode: visualStyle.responsive.widthMode || 'standard',
  //   heightMode: visualStyle.responsive.heightMode || 'adaptive',
  // }
  return {
    ...spec,
    autoFit: true
  }
};


