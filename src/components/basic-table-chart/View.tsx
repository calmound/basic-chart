import React, { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/lib/table';

import { message, Table } from '@osui/ui';

import { ViewProps } from '../lib/type';
import cx from './View.less'
import { getChartsData } from '../lib/utils';
// @ts-ignore
import { NoData } from 'proxima-sdk/components/Components/Chart';

const View = ({ option, tenant, sessionToken }: ViewProps) => {
  const { group = [], value = [] } = option;
  const [resData, setResData] = useState([]);
  const [noDataFlag, setNoDataFlag] = useState(false);
  const [groupHeader, setGroupHeader] = useState([]);

  // group
  // 第一行，聚合header，如事项类型，select的数据源
  // const groupHeader = useMemo(() => {
  //   // if (cluster?.length) {
  //   //   const group = _group.length ? _group[0] : {};
  //   // }
  //   return ["新建", "测试通过", "待测试", "不是bug", "QA测试通过", "挂起", "低级-可延期", "修复中", "已修复", "未复现", "已上线", "测试完成", "需求设计"];
  //   return null;
  // }, [cluster]);

  // const itemType = useItemTypes(workspace?.id); // 事项类型列表, 通过空间进行隔离
  // group
  // const groupHeader = useMemo(() => {
  //   if (data.key === SYSTEM_FIELD.ItemType) {
  //     // 事项类型
  //     return itemType;
  //   }
  //   return data ? data.data : null;
  // }, [data, itemType]);
  // const { data } = useParseQuery(new Parse.Query(CustomField).equalTo('key', groupHeader.key), FetchMethod.First);

  // const columns = [
  //   {
  //     title: '事项类型',
  //     dataIndex: 'name',
  //     key: 'name',
  //     width: 100,
  //   },
  // ];

  const columns = useMemo(() => {
    const firstColumns = [
      {
        title: group[0]?.name || '',
        dataIndex: 'name',
        key: 'name',
        width: 100,
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
            width: 100,
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
      {noDataFlag ? <NoData title="暂无数据，请修改图标数据配置" /> : null}
      <Table
        className={cx.table}
        columns={columns}
        dataSource={resData}
        bordered
        size="middle"
        scroll={{ x: true, y: 900 }}
      />
    </>
  );
};

export default View;
