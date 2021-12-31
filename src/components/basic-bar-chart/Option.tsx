import React from 'react';

import { ConfigCount } from '../common';
import { INIT_OPTION } from '../lib/global';
import { OptionProps } from '../lib/type';

const Option: React.FC<OptionProps> = ({ option = INIT_OPTION, ...defaultProps }) => {
  return <ConfigCount {...defaultProps} option={option} />;
};

export default Option;
