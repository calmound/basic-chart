// @ts-nocheck
import React, { useEffect, useMemo } from 'react';

import { useChartQuery } from 'proxima-sdk/components/Components/Chart';

import CommonView from './CommonView';
import { ViewProps } from '../lib/type';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace, setFetchError, name }) => {
  const id = random ? random : 'hs-heap-chart';
  const { chartData, isNoData = true, fetchError } = useChartQuery(tenant, workspace, sessionToken, option);
  useEffect(() => {
    if (setFetchError) {
      setFetchError(fetchError);
    }
  }, [fetchError, setFetchError])
  const series = [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      stack: 'x',
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      },
      name: '分析中'
    },
    {
      data: [10, 20, 15, 30, 20, 11, 13],
      type: 'bar',
      stack: 'x',
      backgroundStyle: {
        color: 'red'
      },
      name: '以上线',
    }
  ];
  // echarts点击时间获取不到自定义的x轴id，
  const Xdata = [
    { value: '金融', key: 1 },
    { value: '银行', key: 2 },
    { value: '基金', key: 3 },
    { value: '金融同业', key: 4 },
    { value: '资产管理', key: 5 }, 
    { value: '电子银行', key: 6 },
    { value: '等等', key: 7 }];

  const legend = [];
  series.forEach(item => {
    legend.push(item.name);
  });


  const echartData = useMemo(() => {
    const xAxisData = chartData?.payload?.xAxis || [];
    const seriesValue = chartData?.payload?.value || [];

    const xyData = {
      // xAxis: {
      //   data: xAxisData,
      //   show: true,
      // },
      // yAxis: {},
      // series: seriesValue,
      xAxis: {
        type: 'category',
        data: Xdata,
      },
      yAxis: {
        type: 'value'
      },
      legend: {
        data: legend,
        show: !isListView,
        origin: 'vertical',
        bottom: 0,
        textStyle: {
          padding: [10, 0, 0, 0],
        },
        formatter: '{name}',
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
      },
      series: series,
    };
    return {
      ...xyData,
      tooltip: {
        formatter: '{b}: {c}',
      },
    };
  }, [chartData]);

  // name:报表名称，Xdata：x轴的数据，series：堆积柱状图数据
  return <CommonView echartData={echartData} id={id} option={option} isListView={isListView} isNoData={false} name={name} Xdata={Xdata} series={series} />;
};

export default View;
