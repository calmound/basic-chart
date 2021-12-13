import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

import { ViewProps } from '../lib/type';
import { getChartsData } from '../lib/utils';

const View: React.FC<ViewProps> = ({ random, option, tenant }) => {
  const id = random ? 'basic-pie-chart_' + random : 'basic-pie-chart';
  const [echart, setEChart] = useState(null);

  useEffect(() => {
    const chart = echarts.init(document.getElementById(id));
    setEChart(chart);
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
    const pieData = {
      xAxis: {
        show: false,
      },
      series: [
        // 饼状图数值名称都写在series中
        {
          type: 'pie',
          stillShowZeroSum: false,
          data: resData.dataValue,
          radius: '70%',
          center: ['50%', '50%'],
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
        y: 'bottom',
        data: resData.legendData,
        formatter: '{name}',
      },
    };
    const data = pieData;
    if (echart) {
      echart.setOption({
        ...data,
        tooltip: {
          formatter: '{b}: {c} 占比: {d}%',
        },
      });
    }
  }, [tenant, echart, id, option]);

  // return <div id={id} className={'view'} />;
  return <div id={id} className={'view'} />;
};

export default View;
