export type GroupValue = {
  key?: string;
  fieldType?: string;
  name?: string;
};

export type TargetValue = {
  id?: string;
  iql?: IQL;
  selectors?: Selectors;
  targetName?: string;
  value?: GroupValue[];
};

export type ColumnsValue = {
  cellType?: string;
  data?: any;
  dataIndex?: string;
  key?: string;
  objectId?: string
  property: any;
  title: string;
  validation: any;
}

export type OptionValue = {
  type?: string;
  group?: GroupValue[];
  value?: GroupValue[];
  cluster?: GroupValue[];
  iql?: string;
  w?: number;
  // count图表所用
  formula?: string;
  target?: TargetValue[];
  unitName?: string;
  unit?: string;
  precision?: number;
  // item-list使用
  dataNumber?: number;
  selectedColumns?: ColumnsValue[];
};

export type ConfigProps = {
  setOption?: React.Dispatch<any>;
  view?: string;
  option: OptionValue;
  handleChageType?: (type: string) => void;
  setAddTarget?: React.Dispatch<any>;
  addTarget?: any;
};

export type OptionProps = {
  option: OptionValue;
};

export type ViewProps = {
  random?: string;
  option?: OptionValue;
  view?: string;
  workspace?: Workspace;
  // chartData?: { legendData: []; dataValue: [] };
  tenant?: Tenant;
  sessionToken?: string;
  isListView?: boolean;
  setFetchError?: React.Dispatch<boolean>;
};

export type CommonViewProp = {
  id?: string;
  echartData?: any;
  option?: OptionValue;
  isListView?: boolean;
  isNoData?: boolean;
};
