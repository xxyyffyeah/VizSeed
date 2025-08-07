/**
 * AREA图表规范生成Pipeline
 */

import { createAreaStackedSpecPipeline } from './Area_stacked';

// 创建AREA图表Pipeline - 面积图默认使用堆叠模式
export const createAreaSpecPipeline = createAreaStackedSpecPipeline;