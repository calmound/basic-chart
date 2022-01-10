// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';

import { useChartQuery } from 'proxima-sdk/components/Components/Chart';

import CommonView from './CommonView';
import { ViewProps } from '../lib/type';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace, setFetchError, name }) => {
  const id = random ? random : 'hs-heap-chart';
  const { chartData, isNoData = true, fetchError } = useChartQuery(tenant, workspace, sessionToken, option);
  const color = ['#4B8BFF', '#36B37E', '#FFC400', '#2EC7C9', '#B6A2DE', '#5AB1EF', '#FFB980', '#D87A80',
    '#8D98B3', '#E5CF0D', '#97B552', '#95706D', '#91B6F8', '#DC69AA', '#07A2A4', '#9A7FD1', '#588DD5', '#F5994E',
    '#FF95AD', '#9096BB', '#D5B394'];
  useEffect(() => {
    if (setFetchError) {
      setFetchError(fetchError);
    }
  }, [fetchError, setFetchError])
  let totalData = {};

  const data = [
    { data: [130, 220, 165, 110, 90, 121, 143],type: 'bar', },
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      name: '分析中',
      type: 'bar',
    },
    {
      data: [10, 20, 15, 30, 20, 11, 13],
      name: '以上线',
      type: 'bar',
    }
  ]
  // 总数，显示总数时实际是显示一个透明的柱子
  const totalData = {
    data: data[0].data,
    type: data[0].type,
    // stack: 'x',
    barGap: '-100%', //偏移，不在同一柱子上叠加
    itemStyle: {
      normal: {
        color: 'rgba(128, 128, 128, 0)',
        label: {
          show: true,
          position: 'top',
          formatter: "{c}",
        }
      },
    },
  }
  const _series = [];
  // const [legend, setLegend] = useState([]);
  
  const [series, setSeries] = useState(_series)
  useEffect(()=>{
    // 在data中插入itemStyle显示具体数量
    data.map((item,index) => {
      if (index > 0) {
        item['stack'] = 'x';
        item['itemStyle'] = {
          normal: {
            label: {
              show: option.checked,
              position: 'inside',
              formatter: "{c}",
            }
          },
        }
        _series.push(item);
      }
    });
  
  }, [data])

  useEffect(() => {
    // 通过判断checked，决定是否展示总数
    if (option.checked) {
      _series.unshift(totalData);
      setSeries(_series);
    } else {
      _series.forEach((item, index) => {
        if (item === totalData) {
          _series.splice(index, 1)
        }
      })
      setSeries(_series)
    }
  }, [option]);

  // useEffect(()=>{
  //   const _legend = [];
  //   series.forEach(item => {
  //     _legend.push(item.name);
  //   });
  //   setLegend(_legend);
  // },[series])

  // echarts点击时间获取不到自定义的x轴id，
  const Xdata = [
    { value: '金融', key: 1 },
    { value: '银行', key: 2 },
    { value: '基金', key: 3 },
    { value: '金融同业', key: 4 },
    { value: '资产管理', key: 5 },
    { value: '电子银行', key: 6 },
    { value: '等等', key: 7 }];
  const echartData = useMemo(() => {
    const xAxisData = chartData?.payload?.xAxis || [];
    const seriesValue = chartData?.payload?.value || [];

    const legend = [];
    series.forEach(item => {
      legend.push(item.name);
    });
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
        type: 'value',
        name: legend,
        position: 'left',
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: '{value}'
        }
      },
      color: color,
      legend: {
        data: legend,
        show: !isListView,
        origin: 'vertical',
        bottom: 0,
        textStyle: {
          padding: [10, 0, 0, 0],
        },
        formatter: '{name}',
      },
      series: series,
    };
    return {
      ...xyData,
      tooltip: {
        // trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
    };
  }, [chartData, Xdata, series]);

  /**
   * name:报表名称，Xdata：x轴的数据，series：堆积柱状图数据
   * 将x轴数据传递，以便确定堆积柱状图点击的是哪个x轴，方便拿到x轴对应的标识符去请求数据
   */
  return <CommonView echartData={echartData} id={id} option={option} isListView={isListView} isNoData={false} name={name} Xdata={Xdata} series={series} />;
};

export default View;
