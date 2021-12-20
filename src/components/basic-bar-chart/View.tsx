// @ts-nocheck
import React, { useMemo } from 'react';

import { useChartQuery } from '../lib/hooks';

import CommonView from '../common/CommonView';
import { ViewProps } from '../lib/type';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace }) => {
  const id = random ? 'basic-bar-chart_' + random : 'basic-bar-chart';
  const { data, isNoData = true } = useChartQuery(tenant, workspace, sessionToken, option);

  const echartData = useMemo(() => {
    const xAxisData = data?.payload?.xAxis || [];
    const seriesValue = data?.payload?.value || [];

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
  }, [data]);

  return <CommonView echartData={echartData} id={id} option={option} isListView={isListView} isNoData={isNoData} />;
};

export default View;
