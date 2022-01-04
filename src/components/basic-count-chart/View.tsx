// @ts-nocheck
import React, { useEffect, useMemo } from 'react';

import { useChartQueryCount } from 'proxima-sdk/components/Components/Chart';

import CommonView from '../common/CommonView';
import { ViewProps } from '../lib/type';
import classNames from 'classnames';
import  './View.less';
/**
 * todo
 * 接口调试之后略微修改
 * view修改
 */
const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace, setFetchError }) => {
  const id = random ? 'basic-line-chart_' + random : 'basic-line-chart';
  const { chartData, isNoData, fetchError } = useChartQueryCount(tenant, workspace, sessionToken, option);

  useEffect(() => {
    if(setFetchError){
      setFetchError(fetchError);
    }
  }, [fetchError, setFetchError])

  const echartData = useMemo(() => {
    const xAxisData = chartData?.payload?.xAxis || [];
    const seriesValue = chartData?.payload?.value || [];

    const lineData = {
      xAxis: {
        data: xAxisData,
        show: true,
      },
      yAxis: {},
      // formatter: '{b}: {c}',
      series: seriesValue,
    };
    return {
      ...lineData,
      tooltip: {
        formatter: '{b}: {c}',
      },
    };
  }, [chartData]);

  return <div id={id} className={classNames(isListView ? 'basic-chart-count-list' : 'basic-chart-count-detail')} >
    <span className={classNames('view-filter-data')}><span>34.0</span><span style={{float:option?.unit}}>{option?.unitName}</span></span>
  </div>
};

export default View;
