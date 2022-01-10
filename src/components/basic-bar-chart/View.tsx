// @ts-nocheck
import React, { useEffect, useMemo } from 'react';

import { useChartQuery } from 'proxima-sdk/components/Components/Chart';

import CommonView from '../common/CommonView';
import { ViewProps } from '../lib/type';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace, setFetchError }) => {
  const id = random ? random : 'basic-bar-chart';
  const { chartData, isNoData = true, fetchError } = useChartQuery(tenant, workspace, sessionToken, option);
  useEffect(() => {
    if (setFetchError) {
      setFetchError(fetchError);
    }
  }, [fetchError, setFetchError])
  const echartData = useMemo(() => {
    const xAxisData = chartData?.payload?.xAxis || [];
    const seriesValue = chartData?.payload?.value || [];
    const legend = [];
    seriesValue.forEach(item => {
      legend.push(item.name);
    });

    const xyData = {
      xAxis: {
        data: xAxisData,
        show: true,
      },
      yAxis: {},
      series: seriesValue,
      legend: {
        data: legend,
        show: !isListView,
        origin: 'vertical',
        x: 'center',
        bottom: 0,
        textStyle: {
          padding: [10, 0, 0, 0],
        },
        formatter: '{name}',
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
      }
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
