import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

import { ViewProps } from '../lib/type';
import { getChartsData } from '../lib/utils';
// @ts-ignore
import { NoData } from 'proxima-sdk/components/Components/Chart';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken }) => {
  const id = random ? 'basic-pie-chart_' + random : 'basic-pie-chart';
  const [echart, setEChart] = useState(null);
  const [noDataFlag, setNoDataFlag] = useState(false);

  useEffect(() => {
    const dom = document.getElementById(id);
    const echart = echarts.init(dom);
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
      });
      const seriesData = resData?.data?.payload?.value || [];
      const legendData = resData?.data?.payload?.type || [];
      if (!legendData?.length || !seriesData?.length) {
        setNoDataFlag(true);
      } else {
        setNoDataFlag(false);
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
          },
        ],
        legend: {
          origin: 'vertical',
          x: 'center',
          y: 'bottom',
          data: legendData,
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
    }
    fetch();
  }, [id, sessionToken, option, tenant, echart]);

  return (
    <>
      {noDataFlag ? <NoData title="暂无数据，请修改图标数据配置" /> : null}
      <div id={id} className={'view'} />
    </>
  );
};

export default View;

