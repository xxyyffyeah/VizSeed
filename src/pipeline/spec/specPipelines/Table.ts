/**
 * TABLE图表规范生成Pipeline
 */

import { pipeline } from '../../PipelineCore';
import { initData } from '../DataModule';
import { initVTableList } from '../init/initVTable';

// 创建TABLE图表Pipeline
export const createTableSpecPipeline = () => pipeline([
  initVTableList,
  initData
], {});