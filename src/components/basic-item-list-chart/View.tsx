// @ts-nocheck
import React, { useEffect, useMemo } from 'react';
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

import { ViewProps } from '../lib/type';
import { useIQLSearch } from 'proxima-sdk/components/lib/useParseQuery'

const View: React.FC<ViewProps> = function ({ random, option, tenant, sessionToken, isListView, workspace, setFetchError }) {
  const id = random ? 'basic-item-list-chart_' + random : 'basic-item-list-chart';
  // const { selectedColumns } = option;
  const selectedColumns = [
    {
      title: '所属空间',
      dataIndex: 'workspace',
      key: 'workspace',
      cellType: 'Workspace',
      property: {},
      objectId: 'BoLFaSnI89',
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      cellType: 'updatedAt',
      property: {},
      objectId: 'LaXmZ7rAG4',
    },
    {
      title: '事项类型',
      dataIndex: 'itemType',
      key: 'itemType',
      cellType: 'ItemType',
      data: {},
      property: {},
      objectId: 'HYnEJHIDTU',
    },
    {
      title: '计划结束时间',
      dataIndex: 'PlanFinishTime',
      key: 'PlanFinishTime',
      cellType: 'Date',
      property: {
        range: null,
        format: 'YYYY年MM月DD日',
        fieldDesc: '',
        pickerType: 'date',
        placeholder: '',
        defaultValue: null,
      },
      validation: {},
      objectId: 'Gh2KMc9L5k',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      cellType: 'Status',
      property: {},
      objectId: 'lA8PQbbJie',
    },
  ];

  const { chartData, isNoData, fetchError } = useChartQuery(tenant, workspace, sessionToken, option);

  // useEffect(() => {
  //   if(setFetchError){
  //     setFetchError(fetchError);
  //   }
  // }, [fetchError, setFetchError])

  const columns = useMemo(() => {
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
  }, [selectedColumns]);


  return (
    <div id={id}>
      <AutoResizer>
        {({ width, height }) => (
          <BaseTable
            fixed
            width={width}
            height={height}
            rowHeight={40}
            rowKey="objectId"
            // data={dataSource}
            footerHeight={48}
          // footerRenderer={p}
          // ref={baseTableRef}
          // disabled={loading}
          // overlayRenderer={LoadingLayer}
          >
            {columns.map(column => (
              <Column key={column.key} resizable {...column} />
            ))}
          </BaseTable>
        )}
      </AutoResizer>
    </div>
  )
};

export default View;
