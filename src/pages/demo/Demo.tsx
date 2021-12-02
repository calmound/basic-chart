import React from 'react';
import { Input, Rate } from '@osui/ui';
import Error from '@/statics/error.png';
import Logo from '@/statics/Gitee-Scan.svg';
import cx from './Demo.less';
import { useSDK } from '@projectproxima/plugin-sdk';
import { View, Option } from '../../components/pie-chart';

const Demo: React.FC = () => {
  const sdk = useSDK();

  const handleClick = () => {
    sdk.sendAction('openIssuePanel', { issue: 11223 }).then(() => {
      console.log('打开回调');
    });
  };

  return (
    <div>
      {/* <h2 className={cx('title')}>CSS Modules 测试</h2>
      <Input placeholder="OSUI input 测试" />
      <Rate allowHalf defaultValue={2.5} />
      <button onClick={handleClick}>唤起卡片面板</button>
      <div>
        <img src={Error} />
      </div>
      <div>svg测试:</div>
      <Logo /> */}
      <div className={cx('view')}>
        <View />

      </div>
      <Option />
    </div>
  );
};

export default Demo;
