import React from 'react';

import CountOption from './CountOption';
import { INIT_OPTION } from '../lib/global';
import { OptionProps } from '../lib/type';

const Option: React.FC<OptionProps> = ({ option = INIT_OPTION, ...defaultProps }) => {
  return <CountOption {...defaultProps} option={option} />;
};

export default Option;
