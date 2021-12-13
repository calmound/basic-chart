import React, { useMemo } from 'react';
import { ColumnsType } from 'antd/lib/table';

import { Table } from '@osui/ui';

import { ViewProps } from '../lib/type';
import cx from './View.less'

const View = ({ option }: ViewProps) => {
  const { value = [], valueGroup } = option;
  // group
  // 第一行，聚合header，如事项类型，select的数据源
  const groupHeader = useMemo(() => {
    if (valueGroup?.length) {
      // const group = _group.length ? _group[0] : {};
      return [
        { label: '新建', value: 'new' },
        { label: '已开始', value: 'start' },
      ];
    }
    return null;
  }, [valueGroup]);
 
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
  let columns = [];
  const firstColumns = [
    {
      title: '事项类型',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
  ] as ColumnsType<any>;

  // 交叉列
  if (groupHeader) {
    const groupColumns = groupHeader.map(item => {
      return {
        title: '新建',
        children: value.map(k => ({
          title: k.name,
          width: 100,
          render: (text, record) => {
            return record[item.value][k.key];
          },
        })),
      };
    });
    // todo type define
    columns = firstColumns.concat(groupColumns as ColumnsType<any>);
  } else {
    const listColumns = value.map(k => ({
      title: k.name,
      width: 100,
      dataIndex: k.key,
      key: k.key,
    }));
    columns = firstColumns.concat(listColumns);
  }

  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: '事项类型',
      new: {
        priority: 'priority',
        Text: 'count',
      },
      start: {
        priority: 'priority',
        Text: 'count',
      },
    });
  }

  return (
      <Table className={cx.table} columns={columns} dataSource={data} bordered size="middle" scroll={{ x: 'calc(700px + 50%)', y: 240 }} />
  );
};

export default View;
