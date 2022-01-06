// @ts-nocheck
import React, { useEffect, useMemo } from 'react';

import { useChartCountQuery } from 'proxima-sdk/components/Components/Chart';
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
  // const { formula, target, unitName, unit, precision } = option
  const id = random ? 'basic-count-chart_' + random : 'basic-count-chart';
  const { chartData, fetchError, isNoData } = useChartCountQuery(tenant, workspace, sessionToken, option);

  const view = (
    <div id={id} className={cx(isListView ? 'basic-chart-count-list' : 'basic-chart-count-detail')} >
      <span className={cx('view-filter-data')}><span>{chartData?.payload?.result}</span><span style={{ float: option?.unit }}>{option?.unitName}</span></span>
    </div>
  )

  useEffect(() => {
    if (setFetchError) {
      setFetchError(fetchError);
    }
  }, [fetchError, setFetchError])

  return (
    // 处理0的情况
    <>
      {isNoData !== 0 ? !isNoData ? <NoData title="暂无数据，请修改图表数据配置" isListView={isListView} />
        :
        view
        :
        view
      }

    </>
  )
};

export default View;
