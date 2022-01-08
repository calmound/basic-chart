// @ts-nocheck
import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { InputNumber, Button } from '@osui/ui';
import { Formik } from 'formik';
import { FormField } from 'proxima-sdk/components/Components/Common';

import { BASIC_LISTING_CHART, SYSTEM_FIELD } from 'proxima-sdk/lib/Global';

import { FilterQuery } from 'proxima-sdk/components/Components/Chart';
import { ColumnsSettings } from 'proxima-sdk/components/Components/Common';
import { useItemListColumns } from 'proxima-sdk/components/Components/Chart';

import { ConfigProps, GroupValue } from '../lib/type';
import { INIT_ITEM_LIST_OPTION } from '../lib/global';
import cx from './Option.less';

/**
 * todo
 * 输入框只能输入数字
 * 样式微调
 * 接口是否修改
 * view样式还未修改
 * 如何保存selectedColumns
 */
const DEFAULT_SHOW_FIELDS = [
  SYSTEM_FIELD.Key,
  SYSTEM_FIELD.Status,
  SYSTEM_FIELD.ItemType,
  SYSTEM_FIELD.Workspace,
  SYSTEM_FIELD.ItemGroup,
];

const Option: React.FC<ConfigProps> = ({
  option,
  setOption,
  setSearchOption,
  workspace,
  usefulFields,
}) => {
  const { type, cluster, iql, pageSize, columnKeys } = option;
  //全局不需要workspace
  const { selectedColumns, columns } = useItemListColumns(
    usefulFields,
    columnKeys || DEFAULT_SHOW_FIELDS,
    workspace ? workspace : null,
  );

  const ref = useRef(null);

  const initialValues = {
    type: BASIC_LISTING_CHART,
    iql: iql,
  };

  const handleColumnChange = useCallback(
    columns => {
      const columnKeys = columns.filter(c => !c.isHidden).map(c => c.key);
      setOption({ ...option, columnKeys });
    },
    [setOption],
  );

  const handleSubmit = () => {
    setSearchOption(option);
  };

  return (
    <div>
      <Formik innerRef={ref} initialValues={initialValues} onSubmit={handleSubmit}>
        {({ handleSubmit, setFieldValue }) => (
          <>
            <div className={'form-main-title'}>
              <strong className={'info-title'}>图表信息</strong>
              <span
                className={'option-reset'}
                onClick={() => {
                  setOption({ ...option, ...INIT_ITEM_LIST_OPTION });
                  setFieldValue('group', undefined);
                  setFieldValue('cluster', undefined);
                }}
              >
                重置图表
              </span>
            </div>
            <FormField label="每页结果数(最多50条)" name="pageSize">
              {({ field }) => (
                <>
                  <InputNumber
                    {...field}
                    parser={value => `$ ${value}`.replace(/[^\d]/g, '')}
                    formatter={value => value.replace(/[^\d]/g, '')}
                    min={10}
                    placeholder="请输入结果数"
                    value={pageSize}
                    onChange={val => {
                      setOption({ ...option, pageSize: val });
                    }}
                    style={{ width: '100%' }}
                  />
                </>
              )}
            </FormField>
            <FormField name="ColumnsList">
              {({ field }) => (
                <>
                  <div className={cx('columns')}>
                    <ColumnsSettings
                      {...field}
                      titleText="显示列"
                      customColumns={columns}
                      setColumnSettings={handleColumnChange}
                    />
                  </div>
                </>
              )}
            </FormField>
            <div className={'form-main-title'}>
              <strong className={'info-title'}>数据筛选</strong>
              <span
                className={'option-reset'}
                onClick={() => {
                  setOption({ ...option, iql: '', selectors: {}, selectedColumns });
                }}
              >
                重置筛选
              </span>
            </div>
            <FilterQuery setOption={setOption} option={option} />
            <Button type="primary" className="chart-search" onClick={() => handleSubmit()}>
              查询
            </Button>
          </>
        )}
      </Formik>
    </div>
  );
};

export default Option;
