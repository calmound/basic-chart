// @ts-nocheck
import React, { useMemo } from 'react';

import { useChartQuery } from '../lib/hooks';

import CommonView from '../common/CommonView';
import { ViewProps } from '../lib/type';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace }) => {
  const id = random ? 'basic-line-chart_' + random : 'basic-line-chart';
  const { data, isNoData } = useChartQuery(tenant, workspace, sessionToken, option);

  const echartData = useMemo(() => {
    const xAxisData = data?.payload?.xAxis || [];
    const seriesValue = data?.payload?.value || [];

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
        formatter: '{b}: {c} 占比: {d}%',
      },
    };
  }, [data]);

  return <CommonView echartData={echartData} id={id} option={option} isListView={isListView} isNoData={isNoData} />;
};

export default View;
