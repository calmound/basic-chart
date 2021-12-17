import React, { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';

import { message, Table } from '@osui/ui';

import { ViewProps } from '../lib/type';
import './View.less'
import { getChartsData } from '../lib/utils';
// @ts-ignore
import { NoData } from 'proxima-sdk/components/Components/Chart';
import classNames from 'classnames';

const View: React.FC<ViewProps> = ({ option, tenant, sessionToken, isListView }) => {
  const { group = [], value = [] } = option;
  const [resData, setResData] = useState([]);
  const [noDataFlag, setNoDataFlag] = useState(false);
  const [groupHeader, setGroupHeader] = useState([]);

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
    if (!option?.group?.length || !option?.value?.length) {
      setNoDataFlag(true);
    } else {
      setNoDataFlag(false);
    }
    async function fetch() {
      try {
        const resData: any = await getChartsData({
          option,
          tenant,
          sessionToken,
        });
        // todo 返回的data设置setResData
        const data = resData?.data?.payload?.data;
        const cluster = resData?.data?.payload?.cluster;
        setResData(data);
        setGroupHeader(cluster);
        if (!data?.length || !cluster?.length) {
          setNoDataFlag(true);
        } else {
          setNoDataFlag(false);
        }
      } catch (error) {
        message.error(error.message);
      }
    }
    fetch();
  }, [option, sessionToken, tenant]);

  return (
    <>
      {noDataFlag ? <NoData title="暂无数据，请修改图表数据配置" /> : null}
      <div className={classNames(isListView ? 'basic-chart-table-list-wrap' : 'basic-chart-table-wrap')}>
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
