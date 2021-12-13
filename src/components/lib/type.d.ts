export type GroupValue = {
  key?: string;
  fieldType?: string;
  name?: string;
};

export type OptionValue = {
  type: string;
  group: GroupValue[];
  value?: GroupValue[];
  valueGroup: GroupValue[];
  iql?: string;
};

export type ConfigProps = {
  setOption?: React.Dispatch<any>;
  view?: string;
  option: OptionValue;
  handleChageType: (type: string) => void
};

export type OptionProps = {
  option: any;
  handleChageType: (type: string) => void
};

export type ViewProps = {
  random?: string;
  option?: OptionValue;
  view: string;
  workspace?: Workspace;
  chartData?: { legendData: []; dataValue: [] };
  tenant?: Tenant;
};
