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
    // const sortSeriesData = seriesData.sort(function (a, b) {
    //   return b.value - a.value;
    // });
    // const colors = [{normal:{color:'#4B8BFF'}}, {normal:{color:'#36B37E'}}, {normal:{color:'#FFC400'}}];
    // if(seriesData?.length) {
    //   for (let i = 0; i < seriesData.length; i++) {
    //     if (i < 3) {
    //       seriesData[i].itemStyle = colors[i];
    //     }
    //   }
    // }
    const color = ['#4B8BFF', '#36B37E', '#FFC400', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
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
