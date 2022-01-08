// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { omit } from 'lodash';
import { Pagination, Spin } from '@osui/ui';

import { useItemListColumns } from 'proxima-sdk/components/Components/Chart';
import { TableCell, TableTitleCell } from 'proxima-sdk/components/Components/Views';
import BaseTable, {
  AutoResizer,
  BaseTableRefType,
  Column,
} from 'proxima-sdk/components/Components/Common/BaseTable';
import { NoData } from 'proxima-sdk/components/Components/Chart';
import IQLParams from 'proxima-sdk/lib/types/iql';
import withOrderBy from 'proxima-sdk/lib/withOrderBy';
import Item from 'proxima-sdk/lib/Item';
import useIQLSearch from 'proxima-sdk/lib/useIQLSearch';
import { SYSTEM_FIELD } from 'proxima-sdk/lib/Global';

import { ViewProps } from '../lib/type';
import cx from './View.less';

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 20;

const DEFAULT_SHOW_FIELDS = [
  SYSTEM_FIELD.Key,
  SYSTEM_FIELD.Status,
  SYSTEM_FIELD.ItemType,
  SYSTEM_FIELD.Workspace,
  SYSTEM_FIELD.ItemGroup,
];

const View: React.FC<ViewProps> = function ({
  random,
  option,
  isListView,
  workspace,
  usefulFields,
  setFetchError,
}) {
  const baseTableRef = React.useRef<BaseTableRefType>();
  const id = random ? random : 'basic-item-list-chart';
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const { columnKeys } = option;
  const { selectedColumns, columns } = useItemListColumns(
    usefulFields,
    columnKeys || DEFAULT_SHOW_FIELDS,
    workspace ? workspace : null,
  );

  const iqlParams = useMemo<IQLParams>(() => {
    return {
      iql: withOrderBy(option?.iql),
      size: pageSize,
      from: (pageIndex - 1) * pageSize,
    };
  }, [option?.iql, pageSize, pageIndex]);

  //  查询事项
  const { items, count, reload: mutate, loading, isValidating } = useIQLSearch<Item>(iqlParams);

  useEffect(() => {
    if (!loading) {
      setTotal(count);
    }
  }, [count, setTotal, loading]);

  const dataSource = items?.length
    ? items?.map(each => ({ ...each, ...omit(each.values, ['workspace', 'itemType', 'status']) }))
    : null;

  // useEffect(() => {
  //   if(setFetchError){
  //     setFetchError(fetchError);
  //   }
  // }, [fetchError, setFetchError])

  console.log(
    '%c [ TableTitleCell ]-100',
    'font-size:13px; background:pink; color:#bf2c9f;',
    TableTitleCell,
  );
  const columns = useMemo(() => {
    if (selectedColumns?.length) {
      return [
        {
          title: '标题',
          dataKey: 'name',
          key: 'name',
          width: 140,
          // 增加 column 动态标识。禁用 react-base-table column cache
          _timestamp: Date.now(),
          cellRenderer: ({ cellData, rowData }) => {
            return (
              <TableTitleCell
                loading={rowData._skeleton}
                itemId={rowData.objectId}
                cellData={cellData}
              />
            );
          },
        },
        ...selectedColumns.map(
          ({ cellType, property, data, objectId, validation, ...customColumn }) => {
            return {
              ...customColumn,
              width: 140,
              minWidth: 140,
              ellipsis: true,
              cellRenderer: ({ rowData, column }) => (
                <TableCell
                  loading={rowData._skeleton}
                  property={property}
                  data={data}
                  type={cellType}
                  text={rowData[column.dataIndex]}
                  values={rowData.values}
                  id={rowData.objectId}
                  dataIndex={column.dataIndex}
                  objectId={objectId}
                  validation={validation}
                  readonly
                />
              ),
            };
          },
        ),
      ];
    }
  }, [selectedColumns]);

  const LoadingLayer = () => {
    if (!items && loading) {
      return (
        <div className={cx('loading-layer-wrapper')}>
          <Spin />
        </div>
      );
    }
    return null;
  };

  const p = useMemo(
    () => (
      <Pagination
        className={cx('footer-pagination')}
        current={pageIndex}
        pageSize={pageSize}
        onChange={(page, pageSize) => {
          setPageIndex(page);
          setPageSize(pageSize);
        }}
        style={{ padding: '12px', textAlign: 'right' }}
        size="small"
        total={total}
        showTotal={total => `总数：${total}`}
        showQuickJumper
        showSizeChanger={false}
      />
    ),
    [pageIndex, pageSize, total],
  );

  return (
    <>
      {!items || (loading && !dataSource?.length) ? (
        <LoadingLayer />
      ) : dataSource?.length ? (
        <div className={isListView ? cx('view') : cx('detail-view')}>
          <AutoResizer>
            {({ width, height }) => (
              <BaseTable
                fixed
                width={width}
                height={height}
                rowHeight={40}
                rowKey="objectId"
                data={dataSource}
                footerHeight={48}
                footerRenderer={p}
                ref={baseTableRef}
                disabled={loading}
                overlayRenderer={LoadingLayer}
              >
                {columns !== undefined
                  ? columns.map(column => <Column key={column.key} resizable {...column} />)
                  : null}
              </BaseTable>
            )}
          </AutoResizer>
        </div>
      ) : (
        <NoData title="暂无数据，请修改图表数据配置" isListView={isListView} />
      )}
    </>
  );
};

export default View;
