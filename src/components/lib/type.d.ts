export type GroupValue = {
  key?: string;
  fieldType?: string;
  name?: string;
};

export type OptionValue = {
  type: string;
  group: GroupValue[];
  value?: GroupValue[];
  cluster: GroupValue[];
  iql?: string;
  w?: number;
};

export type ConfigProps = {
  setOption?: React.Dispatch<any>;
  view?: string;
  option: OptionValue;
  handleChageType?: (type: string) => void;
};

export type OptionProps = {
  option: any;
};

export type ViewProps = {
  random?: string;
  option?: OptionValue;
  view: string;
  workspace?: Workspace;
  // chartData?: { legendData: []; dataValue: [] };
  tenant?: Tenant;
  sessionToken: string;
};

// // 不同的图表数据格式不一样
// export type ChartDataProps = {
//   legendData?: any;
//   dataValue?: any;
// };
