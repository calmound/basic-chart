// @ts-nocheck
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Formik } from 'formik';

import { DropdownInput } from 'proxima-sdk/components/Components/Chart';

import { FormField } from 'proxima-sdk/components/Components/Common';

import { FIELD_TYPE_KEY_MAPPINGS } from 'proxima-sdk/lib/Global';

import { CustomField, FieldType } from 'proxima-sdk/schema/models';

import Parse from 'proxima-sdk/lib/Parse';
import { CustomField as CustomFieldProps } from 'proxima-sdk/schema/types/models';
import useParseQuery, { FetchMethod } from 'proxima-sdk/hooks/useParseQuery';
import { FilterQuery } from 'proxima-sdk/components/Components/Chart';

import { TargetModalProps } from '../lib/type';
import { Input } from '@osui/ui';

const { Number } = FIELD_TYPE_KEY_MAPPINGS;
const TargetModal: React.FC<TargetModalProps> = ({ target, setTarget }) => {
  const { value, iql } = target;

  useEffect(() => {
    if (!target?.id) {
      setTarget({ id: Math.random().toString(36) });
    }
  });

  // 获取数值类型的自定义字段
  let numQuery = new Parse.Query(CustomField).include('fieldType');
  numQuery = numQuery.matchesQuery('fieldType', new Parse.Query(FieldType).equalTo('key', Number));
  const { data: _numberFields } = useParseQuery(numQuery, FetchMethod.All);

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
    value: value,
    iql: iql,
  };

  return (
    <div>
      <Formik innerRef={ref} initialValues={initialValues} onSubmit={() => {}}>
        {({ setFieldValue }) => (
          <>
            <div>
              <strong>指标名称</strong>
              <Input
                onChange={e => setTarget({ ...target, targetName: e.target.value })}
                value={target?.targetName}
              />
            </div>
            <FormField label="值" name="value">
              {({ field }) => (
                <DropdownInput
                  {...field}
                  customFields={numberFields}
                  value={value}
                  onChange={val => {
                    setTarget({
                      ...target,
                      value: val,
                    });
                    setFieldValue('value', val);
                  }}
                  mode=""
                />
              )}
            </FormField>

            <div className={'form-main-title'}>
              <strong className={'info-title'}>数据筛选</strong>
              <span
                className={'option-reset'}
                onClick={() => {
                  setFieldValue('iql', '');
                  setTarget({ ...target, iql: '', selectors: {} });
                }}
              >
                重置筛选
              </span>
            </div>
            <FilterQuery setOption={setTarget} option={target} />
          </>
        )}
      </Formik>
    </div>
  );
};

export default TargetModal;
