import React, { useEffect } from 'react';
import * as echarts from 'echarts';

type ViewProps = {
  random?: string;
}

const View = ({random}: ViewProps) => {
  const id = random ? 'basic-pie-chart_'+ random : 'basic-pie-chart_';
  useEffect(() => {
    const myChart = echarts.init(document.getElementById(id));
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
      <div id={id} className={'view'} style={{ width: '100%'}}></div>
  );
};

export default View;
