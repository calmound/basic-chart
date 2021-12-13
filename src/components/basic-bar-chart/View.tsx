import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

import { ViewProps } from '../lib/type';

const View: React.FC<ViewProps> = ({ random, option, chartData }) => {
  const id = random ? 'basic-bar-chart_' + random : 'basic-bar-chart';
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const chart = echarts.init(document.getElementById(id));
    setChart(chart);
    // 只需要第一次初始化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 请求数据
  useEffect(() => {
    const xyData = {
      xAxis: {
        data: chartData.legendData,
        show: true,
      },
      yAxis: {},
      // formatter: '{b}: {c}',
      series: [
        {
          type: 'bar',
          data: chartData.dataValue,
          label: {
            normal: {
              position: 'outer',
              // formatter: '{b}: {d}%',
            },
          },
        },
      ],
    };

    const data = xyData;
    if (chart) {
      chart.setOption({
        ...data,
        tooltip: {
          formatter: '{b}: {c} 占比: {d}%',
        },
      });
    }
  }, [chart, chartData.dataValue, chartData.legendData, id, option]);

  // return <div id={id} className={'view'} />;
  return <div id={id} className={'view'} />;
};

export default View;
