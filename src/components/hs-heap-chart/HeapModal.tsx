// @ts-nocheck
import React, { useMemo, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import cx from './HeapModal.less'

// type暂时写这，等迁移之后移出
type ListDataProps = {
  value: number;
  name: string;
}

type HeapModalProps = {
  echartParams: string;
  isListView: boolean;
  name: string;
  dataTotal: number;
  xData: ListDataProps;
  listData: ListDataProps[];
}

const HeapModal: React.FC<HeapModalProps> = ({ echartParams, isListView, name, dataTotal, xData: _xData, listData }) => {
  const id = 'hs-heap-model-chart';
  const [modalEchart, setModalEChart] = useState(null);
  // const [modelData,setModelData] = useState(null);
  // 请求数据，待定
  // const { chartData, isNoData = true, fetchError } = useChartQuery(tenant, workspace, sessionToken, option);

  useEffect(() => {
    const modalEchart = echarts.init(document.getElementById(id));
    setModalEChart(modalEchart);
    return () => {
      document.getElementById(id)?.remove();
    };

    // 只有一次渲染触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 尺寸变化需要重新resize echarts
  useEffect(() => {
    modalEchart && modalEchart.resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalEchart]);

  const echartData = useMemo(() => {
    // const xAxisData = chartData?.payload?.xAxis || [];
    // const seriesValue = chartData?.payload?.value || [];
    const xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const series = [
      {
        data: [10, 22, 28, 43, 49],
        type: 'line',
        name: '留存',
      },
      {
        data: [5, 4, 3, 5, 10],
        type: 'line',
        name: '新增',
      }
    ];
    const legend = [];
    series.forEach(item => {
      legend.push(item.name);
    });
    const xyData = {
      title: {
        text: name + '趋势',
      },
      xAxis: {
        data: xData,
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
      series: series,
      legend: {
        data: legend,
        show: !isListView,
        origin: 'vertical',
        right: 0,
        textStyle: {
          padding: [10, 0, 0, 0],
        },
        formatter: '{name}',
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
      },
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
  }, [echartParams]);



  useEffect(() => {
    if (echartData) {
      modalEchart && modalEchart.setOption(echartData, true);
    }
  }, [modalEchart, echartData]);


  return (
    <>
      <div className={cx('data')}>
        <span className={cx('title')}>
          <span>{dataTotal}</span>
          <span>总数</span>
        </span>
        {
          listData.map(item => {
            return (
              <span className={cx('title')}>
                <span>{item.value}</span>
                <span>{item.name}</span>
              </span>
            )
          })
        }
      </div>
      <div id={id} className={cx('line')} />
    </>

  );
};

export default HeapModal;
