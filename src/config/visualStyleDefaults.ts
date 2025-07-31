import { VisualStyle } from '../types/visualStyle';

export const createDefaultVisualStyle = (): VisualStyle => ({
  title: '',
  color: [],
  legend: {
    visible: true,
    orient: 'right',
    position: 'middle',
  },
  label: {
    visible: true,
  },
  tooltip: {
    visible: true,
  },
  animation: {
    visible: true,
  },
  responsive: {
    widthMode: 'standard',
    heightMode: 'adaptive',
  },
  yAxis: {},
  xAxis: {},
  columnStack: {
    stackRadius: 5,
  },
  pie: {},
  pivotPie: {},
  doughnut: {},
  line: {
    lineStyle: {},
  }
});

export const DEFAULT_VISUAL_STYLE = createDefaultVisualStyle();