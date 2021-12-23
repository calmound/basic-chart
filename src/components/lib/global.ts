export const LABEL_TYPE = [
  {
    type: 'pie',
    label2: '维度',
    label3: '值',
  },
  {
    type: 'line',
    label2: 'X轴',
    label3: 'Y轴',
  },
  {
    type: 'bar',
    label2: 'X轴',
    label3: 'Y轴',
  },
];
export const BASIC_PIE_CHART = 'basic-pie-chart';
export const BASIC_LINE_CHART = 'basic-line-chart';
export const BASIC_BAR_CHART = 'basic-bar-chart';
export const BASIC_TABLE_CHART = 'basic-table-chart';

export const CHART_TYPE_INFO = {
  [BASIC_PIE_CHART]: {
    name: '饼图',
    groupLabel: '维度',
    valueLabel: '值',
    type: 'pie',
  },
  [BASIC_LINE_CHART]: {
    name: '折线图',
    groupLabel: 'X轴',
    valueLabel: 'Y轴',
    type: 'line',
  },
  [BASIC_BAR_CHART]: {
    name: '柱状图',
    groupLabel: 'X轴',
    valueLabel: 'Y轴',
    type: 'bar',
  },

  [BASIC_TABLE_CHART]: {
    name: '普通表格',
    groupLabel: '维度',
    valueLabel: '值',
    valueGroupLabel: '列纬度',
    type: 'table',
  },
};

export const DIM_TYPE = [
  {
    label: '事项类型',
    value: 'event_type',
  },
  {
    label: 'PM负责人',
    value: 'PM_chargePerson',
  },
  {
    label: '事项进度',
    value: 'event_progress',
  },
  {
    label: '优先级',
    value: 'priority',
  },
];

export const INIT_OPTION = {
  value: [],
  group: [],
  cluster: [],
  iql: '',
  _selectors:null,
};
