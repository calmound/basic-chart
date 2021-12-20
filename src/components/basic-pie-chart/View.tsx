// @ts-nocheck
import React, { useMemo } from 'react';

import { useChartQuery } from '../lib/hooks';

import CommonView from '../common/CommonView';
import { ViewProps } from '../lib/type';

const View: React.FC<ViewProps> = function ({ random, option, tenant, sessionToken, isListView, workspace }) {
  const id = random ? 'basic-pie-chart_' + random : 'basic-pie-chart';

  const { data, isNoData } = useChartQuery(tenant, workspace, sessionToken, option);

  const echartData = useMemo(() => {
    const seriesData = data?.payload?.value || [];
    const legendData = data?.payload?.type || [];
    const color = ['#4B8BFF', '#36B37E', '#FFC400', '#2EC7C9', '#B6A2DE', '#5AB1EF', '#FFB980', '#D87A80',
      '#8D98B3', '#E5CF0D', '#97B552', '#95706D', '#91B6F8', '#DC69AA', '#07A2A4', '#9A7FD1', '#588DD5', '#F5994E',
      '#FF95AD', '#9096BB', '#D5B394'];
    const pieData = {
      xAxis: {
        show: false,
      },
      color: color,
      series: [
        // 饼状图数值名称都写在series中
        {
          type: 'pie',
          stillShowZeroSum: false,
          data: seriesData,
          radius: '70%',
          center: ['50%', '50%'],
          legndHoverLink: true,
          label: {
            normal: {
              position: 'outer',
              formatter: '{b}: {d}%',
            },
          },
          label: {
            show: true,
          },
        },
      ],
      legend: {
        show: !isListView,
        origin: 'vertical',
        x: 'center',
        bottom: 0,
        textStyle: {
          padding: [10, 0, 0, 0],
        },
        data: legendData,
        formatter: '{name}',
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
      },

    };

    return {
      ...pieData,
      tooltip: {
        formatter: '{b}: {c} 占比: {d}%',
      },
    };
  }, [data]);

  return <CommonView echartData={echartData} id={id} option={option} isListView={isListView} isNoData={isNoData} />;
};

export default View;
