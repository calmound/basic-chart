// @ts-nocheck
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Formik } from 'formik';

import { DropdownInput } from 'proxima-sdk/components/Components/Chart';

import { FormField } from 'proxima-sdk/components/Components/Common';

import {
  BASIC_LINE_CHART,
  BASIC_PIE_CHART,
  BASIC_TABLE_CHART,
  FIELD_TYPE_KEY_MAPPINGS,
  INIT_CHART_GROUP_LINE_VALUE,
  INIT_CHART_GROUP_VALUE,
} from 'proxima-sdk/lib/Global';

import { CustomField, FieldType } from 'proxima-sdk/schema/models';

import Parse from 'proxima-sdk/lib/Parse';
import { CustomField as CustomFieldProps } from 'proxima-sdk/schema/types/models';
import useParseQuery, { FetchMethod } from 'proxima-sdk/hooks/useParseQuery';
import { FilterQuery } from 'proxima-sdk/components/Components/Chart'


import { ConfigProps, GroupValue } from '../lib/type';
import { Input } from '@osui/ui';

const { Number, User, Dropdown, ItemType, Status, Date, CreatedAt, UpdatedAt } = FIELD_TYPE_KEY_MAPPINGS;
const TargetModal: React.FC<ConfigProps> = ({ addTarget, setAddTarget }) => {

  useEffect(()=>{
    if(!addTarget?.id){
      setAddTarget({id: Math.random().toString(36).substr(2)});
    }
  })

  const { type, value, iql } = addTarget;
  // 获取数据源类型的自定义字段
  let selectQuery = new Parse.Query(CustomField).include('fieldType');
  selectQuery = selectQuery.matchesQuery(
    'fieldType',
    new Parse.Query(FieldType).containedIn('key', [Dropdown, User, ItemType, Status]),
  );
  const { data: _xData } = useParseQuery(selectQuery, FetchMethod.All);

  // 获取列纬度的自定义字段
  let clusterQuery = new Parse.Query(CustomField).include('fieldType');
  clusterQuery = clusterQuery.matchesQuery(
    'fieldType',
    new Parse.Query(FieldType).containedIn('key', [Dropdown, ItemType, Status]),
  );
  const { data: _clusterData } = useParseQuery(clusterQuery, FetchMethod.All);

  // 获取数值类型的自定义字段
  let numQuery = new Parse.Query(CustomField).include('fieldType');
  numQuery = numQuery.matchesQuery('fieldType', new Parse.Query(FieldType).equalTo('key', Number));
  const { data: _numberFields } = useParseQuery(numQuery, FetchMethod.All);

  let dateQuery = new Parse.Query(CustomField).include('fieldType');
  dateQuery = dateQuery.matchesQuery(
    'fieldType',
    new Parse.Query(FieldType).containedIn('key', [Date, CreatedAt, UpdatedAt]),
  );
  const { data: _dateFields } = useParseQuery(dateQuery, FetchMethod.All);

  const numberFields = useMemo(() => {
    return [
      {
        key: 'count',
        fieldType: {
          key: 'count',
        },
        name: '事项数',
      },
    ].concat(_numberFields || []) as CustomFieldProps[];
  }, [_numberFields]);

  const ref = useRef(null);

  const initialValues = {
    type: type || BASIC_PIE_CHART,
    // group: group?.length ? (group[0] as GroupValue)?.key : undefined,
    value: value,
    // cluster: cluster?.length ? (cluster[0] as GroupValue)?.key : undefined,
    iql: iql,
  };


  return (
    <div>
      <Formik innerRef={ref} initialValues={initialValues} onSubmit={() => { }}>
        {({ setFieldValue }) => (
          <>
          <div>
          <strong>指标名称</strong>
          <Input onChange={(e)=>setAddTarget({...addTarget,targetName:e.target.value})} value={addTarget?.targetName} />
          </div>
            <FormField label="值" name="value">
              {({ field }) => (
                <DropdownInput
                  {...field}
                  customFields={numberFields}
                  value={value}
                  onChange={val => {
                    // setOption({
                    //   ...option,
                    //   value: val,
                    // });
                    setAddTarget({
                      ...addTarget,
                      value: val,
                      // group:[],
                    })
                    setFieldValue('value', val);
                  }}
                  mode=''
                />
              )}
            </FormField>

            <div style={{ height: '16px' }}></div>

            <div className={'form-main-title'}>
              <strong className={'info-title'}>数据筛选</strong>
              <span
                className={'option-reset'}
                onClick={() => {
                  setFieldValue('iql', '');
                  // setOption({ ...option, iql: '', selectors: {} });
                  setAddTarget({ ...addTarget, iql: '', selectors: {} })
                }}
              >
                重置筛选
              </span>
            </div>
            <FilterQuery
              setOption={setAddTarget}
              option={addTarget}
            />
          </>
        )}
      </Formik>
    </div>
  );
};

export default TargetModal;
