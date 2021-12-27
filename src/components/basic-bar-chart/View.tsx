// @ts-nocheck
import React, { useEffect, useMemo } from 'react';

import { useChartQuery } from 'proxima-sdk/components/Components/Chart';

import CommonView from '../common/CommonView';
import { ViewProps } from '../lib/type';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace, isFetchError}) => {
  const id = random ? 'basic-bar-chart_' + random : 'basic-bar-chart';
  const { chartData, isNoData = true, isError } = useChartQuery(tenant, workspace, sessionToken, option);
  useEffect(() => {
    if(isFetchError){
      isFetchError(isError);
    }
  }, [isError, isFetchError])
  const echartData = useMemo(() => {
    const xAxisData = chartData?.payload?.xAxis || [];
    const seriesValue = chartData?.payload?.value || [];

    const xyData = {
      xAxis: {
        data: xAxisData,
        show: true,
      },
      yAxis: {},
      series: seriesValue,
    };
    return {
      ...xyData,
      tooltip: {
        formatter: '{b}: {c}',
      },
    };
  }, [chartData]);

  return <CommonView echartData={echartData} id={id} option={option} isListView={isListView} isNoData={isNoData} />;
};

export default View;
