// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { omit } from 'lodash';

import { useChartQuery } from 'proxima-sdk/components/Components/Chart';
import { TableCell } from 'proxima-sdk/components/Components/Views';
import { OverflowTooltip } from 'proxima-sdk/components/Components/Common';
import BaseTable, { AutoResizer, BaseTableRefType, Column } from 'proxima-sdk/components/Components/Common';
import {
  TableCell,
  TableTitleCell,
  useTableActionMenuHandlers,
  useTableActionMenuRenderer,
  useTableColumns,
} from 'proxima-sdk/components/Components/Views';
import IQLParams from 'proxima-sdk/lib/types/iql';
import withOrderBy from 'proxima-sdk/lib/withOrderBy';
import Item from 'proxima-sdk/lib/Item';
import useIQLSearch from 'proxima-sdk/lib/useIQLSearch'

import { ViewProps } from '../lib/type';

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 20;

const View: React.FC<ViewProps> = function ({ random, option, tenant, sessionToken, isListView, workspace, setFetchError }) {
  const baseTableRef = React.useRef<BaseTableRefType>();
  const id = random ? 'basic-item-list-chart_' + random : 'basic-item-list-chart';
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const { selectedColumns } = option;


  // const { chartData, isNoData, fetchError } = useChartQuery(tenant, workspace, sessionToken, option);
  const iqlParams = useMemo<IQLParams>(() => {
    return {
      iql: withOrderBy(option?.iql),
      size: pageSize,
      from: (pageIndex - 1) * pageSize,
    };
  }, [option?.iql, pageSize, pageIndex]);

  //  查询事项
  const { items, count, reload: mutate, loading, isValidating } = useIQLSearch<Item>(iqlParams);
  const dataSource = items?.length ? items?.map(each => ({ ...each, ...omit(each.values, ['workspace', 'itemType', 'status']) })) : null;

  // useEffect(() => {
  //   if(setFetchError){
  //     setFetchError(fetchError);
  //   }
  // }, [fetchError, setFetchError])

  const columns = useMemo(() => {
    if (selectedColumns?.length) {
      return [
        // { title: 'Id', dataKey: 'objectId', key: 'objectId', frozen: Column.FrozenDirection.LEFT, width: 100 },
        {
          title: '标题',
          dataKey: 'name',
          key: 'name',
          frozen: Column.FrozenDirection.LEFT,
          width: 340,
          minWidth: 340,
          // 增加 column 动态标识。禁用 react-base-table column cache
          _timestamp: Date.now(),
          cellRenderer: ({ cellData, rowData }) => {
            return (
              <TableTitleCell
                loading={rowData._skeleton}
                itemId={rowData.objectId}
                cellData={cellData}
              // onClick={handleActionClick}
              // tableActions={renderTableAction({ itemId: rowData.objectId, rowData })}
              />
            );
          },
        },
        ...selectedColumns.map(({ cellType, property, data, objectId, validation, ...customColumn }) => {
          return {
            ...customColumn,
            width: 140,
            minWidth: 140,
            ellipsis: true,
            cellRenderer: ({ rowData, column }) => (
              <TableCell
                property={property}
                data={data}
                type={cellType}
                text={rowData[column.dataIndex]}
                values={rowData.values}
                id={rowData.objectId}
                dataIndex={column.dataIndex}
                objectId={objectId}
                validation={validation}
              />
            ),
          };
        }),
      ];
    }

  }, [selectedColumns]);

  return (
    <div style={{ height: '100%' }}>
      {/* {dataSource !== undefined && columns !== undefined ?
        <AutoResizer>
          {({  }) => (
            <BaseTable
              fixed
              width={140}
              height={40}
              rowHeight={40}
              rowKey="objectId"
              data={dataSource}
              footerHeight={48}
              // footerRenderer={p}
              ref={baseTableRef}
            // disabled={loading}
            // overlayRenderer={LoadingLayer}
            >
              {columns !== undefined ? columns.map(column => (
                <Column key={column.key} resizable {...column} />
              )) : null}
            </BaseTable>
          )}
       </AutoResizer>
        :
        null
      } */}

    </div>
  )
};

export default View;
