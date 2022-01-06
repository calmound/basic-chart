// @ts-nocheck
import React from 'react';

import ListOption from './ListOption';
import { INIT_OPTION } from '../lib/global';
import { OptionProps } from '../lib/type';

import ListOption from './ListOption';

const Option: React.FC<OptionProps> = ({ option, ...defaultProps }) => {
  return <ListOption {...defaultProps} option={option} />
};

export default Option;
