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
    const sortSeriesData = seriesData.sort(function (a, b) {
      return b.value - a.value;
    });

    for (let i = 0; i < sortSeriesData.length; i++) {
      if (i < 3) {
        sortSeriesData[i].label = {
          show: true,
          formatter: '{b}: {d}%',
        };
        sortSeriesData[i].labelLine = {
          show: true,
        };
      } else {
        sortSeriesData[i].label = {
          show: false,
        };
      }
    }

    const pieData = {
      xAxis: {
        show: false,
      },
      series: [
        // 饼状图数值名称都写在series中
        {
          type: 'pie',
          stillShowZeroSum: false,
          data: sortSeriesData,
          radius: '70%',
          center: ['50%', '45%'],
          legndHoverLink: true,
          label: {
            normal: {
              position: 'outer',
              formatter: '{b}: {d}%',
            },
          },
        },
      ],
      legend: {
        origin: 'vertical',
        x: 'center',
        bottom: 0,
        textStyle: {
          padding: [10, 0, 0, 0],
        },
        data: legendData,
        formatter: '{name}',
      },
      color: ['#0C62FF', '#36B37E', '#FFAB00', '#6554C0', '#00B8D9', '#FF8F73', '#DE350B', '#C26A00'],
    };

    return {
      ...pieData,
      tooltip: {
        formatter: '{b}: {c} 占比: {d}%',
      },
    };
  }, [data]);

  console.log('%c [  ]-79', 'font-size:13px; background:pink; color:#bf2c9f;', 12212)
  return <CommonView echartData={echartData} id={id} option={option} isListView={isListView} isNoData={isNoData} />;
};

export default View;
