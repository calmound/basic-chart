import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

import { ViewProps } from '../lib/type';
import { getChartsData } from '../lib/utils';
// @ts-ignore
import { NoData } from 'proxima-sdk/components/Components/Chart';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken, isListView, workspace }) => {
  const id = random ? 'basic-pie-chart_' + random : 'basic-pie-chart';
  const [echart, setEChart] = useState(null);
  const [noDataFlag, setNoDataFlag] = useState(false);

  useEffect(() => {
    const dom = document.getElementById(id);
    const echart = dom && echarts.init(dom);
    setEChart(echart);

    return () => {
      document.getElementById(id)?.remove();
    };
    // 只需要第一次初始化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    echart && echart.resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [echart, option?.w]);

  // 请求数据
  useEffect(() => {
    if (!option?.group?.length || !option?.value?.length) {
      setNoDataFlag(true);
    } else {
      setNoDataFlag(false);
    }
    async function fetch() {
      const resData: any = await getChartsData({
        option,
        tenant,
        sessionToken,
        workspace,
      });
      const seriesData = resData?.data?.payload?.value || [];
      const legendData = resData?.data?.payload?.type || [];
      if (!legendData?.length || !seriesData?.length) {
        setNoDataFlag(true);
      } else {
        setNoDataFlag(false);
      }
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
            center: ['50%', '50%'],
            legndHoverLink: true,
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

      const data = pieData;
      if (echart) {
        echart.setOption({
          ...data,
          tooltip: {
            formatter: '{b}: {c} 占比: {d}%',
          },
        });
      }
    }
    fetch();
  }, [id, sessionToken, option, tenant, echart]);

  return (
    <>
      {noDataFlag ? <NoData title="暂无数据，请修改图表数据配置" isListView={isListView} /> : null}
      <div id={id} className={'view echarts-view'} />
    </>
  );
};

export default View;

