// @ts-nocheck
import React, { useEffect, useMemo } from 'react';

import { useChartQueryCount } from 'proxima-sdk/components/Components/Chart';
import { NoData } from 'proxima-sdk/components/Components/Chart';

import { ViewProps } from '../lib/type';
import classNames from 'classnames';
import cx from './View.less';
/**
 * todo
 * 接口调试之后略微修改
 * view修改
 */
const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace, setFetchError }) => {
  const { formula, target, unitName, unit, precision } = option
  const id = random ? 'basic-count-chart_' + random : 'basic-count-chart';
  const data = !target ? null : useChartQueryCount(tenant, workspace, sessionToken, option);

  // useEffect(() => {
  //   if (setFetchError) {
  //     setFetchError(data?.fetchError);
  //   }
  // }, [data?.fetchError, setFetchError])

  return (
    <>
      {!data ? <NoData title="暂无数据，请修改图表数据配置" isListView={isListView} />
        :
        <div id={id} className={cx(isListView ? 'basic-chart-count-list' : 'basic-chart-count-detail')} >
          <span className={cx('view-filter-data')}><span>34.0</span><span style={{ float: option?.unit }}>{option?.unitName}</span></span>
        </div>}

    </>
  )
};

export default View;
