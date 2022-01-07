import React from 'react';

import Config from './Config';
import { INIT_OPTION } from '../lib/global';
import { OptionProps } from '../lib/type';

const Option: React.FC<OptionProps> = ({ option = INIT_OPTION, ...defaultProps }) => {
  return <Config {...defaultProps} option={option} />;
  // return <div>堆积柱状图Option</div>
};

export default Option;
