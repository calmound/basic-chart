import React from 'react';

import { Config } from '../common';
import { INIT_OPTION } from '../lib/global';
import { OptionProps } from '../lib/type';

const Option: React.FC<OptionProps> = ({ option = INIT_OPTION, ...defaultProps }) => {
  // return <Config {...defaultProps} option={option} />;
  return <div>事项统计Option</div>
};

export default Option;
