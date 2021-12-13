import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

import { ViewProps } from '../lib/type';
import { getChartsData } from '../lib/utils';

const View: React.FC<ViewProps> = ({ random, option, tenant }) => {
  const id = random ? 'basic-line-chart_' + random : 'basic-line-chart';
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const chart = echarts.init(document.getElementById(id));
    setChart(chart);
    // 只需要第一次初始化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 请求数据
  useEffect(() => {
    /**
     * 暂时将数据类型定义为any
     */
     const resData: any = getChartsData({
      option,
      tenant,
    });
    const xyData = {
      xAxis: {
        data: resData.legendData,
        show: true,
      },
      yAxis: {},
      // formatter: '{b}: {c}',
      series: [
        {
          type: 'line',
          data: resData.dataValue,
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
  }, [chart, tenant, id, option]);

  return <div id={id} className={'view'} />;
};

export default View;
