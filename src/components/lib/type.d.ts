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
  view?: string;
  workspace?: Workspace;
  // chartData?: { legendData: []; dataValue: [] };
  tenant?: Tenant;
  sessionToken?: string;
  isListView?: boolean;
  isFetchError?: React.Dispatch<boolean>;
};

export type CommonViewProp = {
  id?: string;
  echartData?: any;
  option?: OptionValue;
  isListView?: boolean;
  isNoData?: boolean;
};
