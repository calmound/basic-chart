import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const View = () => {
  useEffect(() => {
    const myChart = echarts.init(document.getElementById('basic-pie-chart'));
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例',
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    });
  }, []);
  return (
    <div>
      <div id="basic-pie-chart" style={{ width: '100%', height: '300px' }}></div>
    </div>
  );
};

export default View;
