// @ts-nocheck
import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { NoData } from 'proxima-sdk/components/Components/Chart';
import { Modal } from '@osui/ui';
import HeapModal from './HeapModal';
import cx from './CommonView.less';
// type暂时写这，等迁移之后移出
type XDataProps = {
  key: number,
  value: string,
}

type LabelProps = {
  formatter: string;
  position: string;
  show: boolean | undefined;
}

type NormalProps = {
  label: LabelProps;
}

type ItemStyleProps = {
  normal: NormalProps;
}

type SeriesProps = {
  data: Array<number>;
  name: string;
  stack: string;
  type: string;
  itemStyle: ItemStyleProps;
}

type CommonViewProps = {
  echartData: any;
  id: number;
  option: OptionValue;
  isListView: boolean;
  isNoData: boolean;
  name: string;
  Xdata: XDataProps[];
  series: SeriesProps[];
}


const CommonView: React.FC<CommonViewProps> = props => {
  const { echartData, id, option, isListView, isNoData, name, Xdata, series } = props;
  const [echart, setEChart] = useState(null);
  // x轴名称，对应弹窗title
  const [echartParams, setEchartParams] = useState(null);
  const [visible, setVisible] = useState(false);
  // 点击柱状图数据总和
  const [dataTotal, setDataTotal] = useState(0);
  // 点击时对应的x轴的信息
  const [xData, setXData] = useState(null);
  // 点击时此柱状图的数据与名称
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const echart = echarts.init(document.getElementById(id));
    setEChart(echart);
    // 每小段柱子都有点击事件
    echart.on('click', function (params) {
      let xIndex = params?.dataIndex;
      let total = 0;
      const listData = [];
      series.forEach(item => {
        const data = {};
        total += item.data[xIndex];
        data.name = item.name;
        data.value = item.data[xIndex];
        listData.push(data);
      })
      setListData(listData);
      setDataTotal(total);
      setXData(Xdata[xIndex]);
      setEchartParams(Xdata[xIndex]?.value);
      setVisible(true);
    })

    // 整条柱状区域点击事件；
    // echart.getZr().on('click', params => {
    //   let pointInPixel = [params.offsetX, params.offsetY]
    //   if (echart.containPixel('grid', pointInPixel)) {
    //     // 点击的x轴下标
    //     let xIndex = echart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
    //     // 通过下标去确定x轴的id与数据的总数
    //     let total = 0;
    //     const listData = [];
    //     series.forEach(item=>{
    //       const data = {};
    //       total += item.data[xIndex];
    //       data.name = item.name;
    //       data.value = item.data[xIndex];
    //       listData.push(data);
    //     })
    //     setListData(listData);
    //     setDataTotal(total);
    //     setXData(Xdata[xIndex]);
    //     setEchartParams(Xdata[xIndex]?.value);
    //     setVisible(true);
    //   }
    // })
    return () => {
      document.getElementById(id)?.remove();
    };

    // 只有一次渲染触发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isNoData) {
      echart && echart.setOption(echartData, true);
    }
  }, [echart, echartData, isNoData]);

  // 尺寸变化需要重新resize echarts
  useEffect(() => {
    echart && echart.resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [echart, option?.w]);



  return (
    <>
      {/* {isNoData ? <NoData title="暂无数据，请修改图表数据配置" isListView={isListView} /> : null} */}
      <div id={id} className={'view echarts-view'} />
      <Modal
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        className={cx('modal')}
        title={echartParams}
      >
        <HeapModal echartParams={echartParams} isListView={isListView} name={name} dataTotal={dataTotal} xData={xData} listData={listData} />
      </Modal>
    </>
  );
};

export default CommonView;
