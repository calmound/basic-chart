import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';

import { getChartsData } from '../lib/utils';
import { ViewProps } from '../lib/type';
// @ts-ignore
import { NoData } from 'proxima-sdk/components/Components/Chart';

const View: React.FC<ViewProps> = ({ random, option, tenant, sessionToken }) => {
  const id = random ? 'basic-bar-chart_' + random : 'basic-bar-chart';
  const [echart, setChart] = useState(null);
  const [noDataFlag, setNoDataFlag] = useState(false);

  useEffect(() => {
    const echart = echarts.init(document.getElementById(id));
    setChart(echart);
    return () => {
      document.getElementById(id)?.remove();
    };
    // 只需要第一次初始化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    echart && echart.resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [echart, option.w]);

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
      const xAxisData = resData?.data?.payload?.xAxis || [];
      const seriesValue = resData?.data?.payload?.value || [];
      if (!seriesValue?.length || !xAxisData?.length) {
        setNoDataFlag(true);
      } else {
        setNoDataFlag(false);
      }
      const xyData = {
        xAxis: {
          data: xAxisData,
          show: true,
        },
        yAxis: {},
        // formatter: '{b}: {c}',
        series: seriesValue,
      };

      const data = xyData;
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
  }, [echart, option, sessionToken, tenant]);

  return (
    <>
      {noDataFlag ? <NoData title="暂无数据，请修改图标数据配置" /> : null}
      <div id={id} className={'view'} />
    </>
  );
};

export default View;
