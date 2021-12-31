// @ts-nocheck
import React, { useEffect, useMemo } from 'react';

import { useChartQuery } from 'proxima-sdk/components/Components/Chart';

import CommonView from '../common/CommonView';
import { ViewProps } from '../lib/type';
import classNames from 'classnames';
import  './View.less';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace, setFetchError }) => {
  const id = random ? 'basic-line-chart_' + random : 'basic-line-chart';
  const { chartData, isNoData, fetchError } = useChartQuery(tenant, workspace, sessionToken, option);

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

  // return <CommonView echartData={echartData} id={id} option={option} isListView={isListView} isNoData={isNoData} />;
  return <div id={id} className={classNames(isListView ? 'basic-chart-count-list' : 'basic-chart-count-detail')} >
    <span className={classNames('view-filter-data')}><span>50.0</span><span style={{float:option?.unit}}>{option?.unitName}</span></span>
  </div>
};

export default View;
