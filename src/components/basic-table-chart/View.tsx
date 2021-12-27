// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';

import { useChartQuery } from 'proxima-sdk/components/Components/Chart';

import { Table } from '@osui/ui';

import { NoData } from 'proxima-sdk/components/Components/Chart';

import { ViewProps } from '../lib/type';

import  './View.less';

const View: React.FC<ViewProps> = ({ option, tenant, sessionToken, isListView, workspace, isFetchError }) => {
  const { group = [], value = [], cluster = [] } = option;
  const [resData, setResData] = useState([]);
  const [groupHeader, setGroupHeader] = useState([]);
  const { chartData, isNoData, isError } = useChartQuery(tenant, workspace, sessionToken, option);

  useEffect(() => {
    if(isFetchError){
      isFetchError(isError);
    }
  }, [isError, isFetchError])

  const columns = useMemo(() => {
    const firstColumns = [
      {
        title: group[0]?.name || '',
        dataIndex: 'name',
        key: 'name',
        width: 130,
        align: 'center',
      },
    ] as ColumnsType<any>;
    if (groupHeader) {
      const groupColumns = groupHeader.map(item => {
        return {
          title: item,
          align: 'center',
          children: value.map(k => ({
            title: k.name,
            key: `${item}-${k.key}`,
            width: 130,
            align: 'center',
            render: (text, record) => {
              return record?.[item]?.[k.key] || '-';
            },
          })),
        };
      });
      // todo type define
      return firstColumns.concat(groupColumns as ColumnsType<any>);
    } else {
      const listColumns = value.map(k => ({
        title: k.name,
        width: 100,
        dataIndex: k.key,
        key: k.key,
        align: 'center',
      }));
      return firstColumns.concat(listColumns as any);
    }
  }, [group, groupHeader, value]);

  useEffect(() => {
    const resData = chartData?.payload?.data;
    const cluster = chartData?.payload?.cluster;
    setResData(resData);
    setGroupHeader(cluster);
  }, [chartData]);

  return (
    <>
      {isNoData ? <NoData title="暂无数据，请修改图表数据配置" isListView={isListView} /> : null}
      <div
        className={classNames(
          isListView ? 'basic-chart-table-list-wrap' : 'basic-chart-table-wrap',
        )}
      >
        <Table
          className={'baisc-table'}
          columns={columns}
          dataSource={resData}
          bordered
          size={isListView ? 'small' : 'middle'}
          scroll={{ x: 'max-content', y: isListView ? 200 : 500 }}
          pagination={false}
        />
      </div>
    </>
  );
};

export default View;
