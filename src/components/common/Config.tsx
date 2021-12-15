import React, { useMemo, useRef } from 'react';
import { Input, Select } from '@osui/ui';
import { Formik } from 'formik';
// @ts-ignore
import { DropdownInput } from 'proxima-sdk/components/Components/Chart';
// @ts-ignore
import { FormField } from 'proxima-sdk/components/Components/Common';
// @ts-ignore
import { FIELD_TYPE_KEY_MAPPINGS } from 'proxima-sdk/lib/Global';
// @ts-ignore
import { CustomField, FieldType } from 'proxima-sdk/schema/models';
// @ts-ignore
import Parse from 'proxima-sdk/lib/Parse';
// @ts-ignore
import { CustomField as CustomFieldProps } from 'proxima-sdk/schema/types/models';
// @ts-ignore
import useParseQuery, { FetchMethod } from 'proxima-sdk/hooks/useParseQuery';

import { BASIC_PIE_CHART, BASIC_TABLE_CHART, CHART_TYPE_INFO, INIT_OPTION } from '../lib/global';
import { ConfigProps, GroupValue } from '../lib/type';
const { TextArea } = Input;

const { Number, User, Dropdown, ItemType } = FIELD_TYPE_KEY_MAPPINGS;

/**
 * todo.....
 */
 const Config: React.FC<ConfigProps> = ({ option, setOption, handleChageType }) => {
  const { type, group, value } = option;
  // 获取数据源类型的自定义字段
  let selectQuery = new Parse.Query(CustomField).include('fieldType');
  selectQuery = selectQuery.matchesQuery(
    'fieldType',
    new Parse.Query(FieldType).containedIn('key', [Dropdown, User, ItemType]),
  );
  const { data: _xData } = useParseQuery(selectQuery, FetchMethod.All);

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

  // 下拉类型的字段
  const groupOptions = useMemo(() => {
    return _xData?.length
      ? _xData.map(c => (
          <Select.Option value={c.key} key={c.key} fieldType={ItemType} name={c.name}>
            {c.name}
          </Select.Option>
        ))
      : [];
  }, [_xData]);

  const { groupLabel, valueLabel, valueGroupLabel } = CHART_TYPE_INFO[type];
  const ref = useRef(null);

  const initialValues = {
    type: type || BASIC_PIE_CHART,
    group: group?.length ? (group[0] as GroupValue)?.key : undefined,
    value: value,
    // cluster: cluster,
  };

  const typeOptions = useMemo(() => {
    return Object.keys(CHART_TYPE_INFO).map(key => (
      <Select.Option value={key} key={key}>
        {CHART_TYPE_INFO[key].name}
      </Select.Option>
    ));
  }, []);

  const groupValue = useMemo(() => {
    if (group?.length) {
      return group[0].name;
    }
    return undefined;
  }, [group]);

  return (
    <div>
      <Formik innerRef={ref} initialValues={initialValues} onSubmit={() => {}}>
        {({ setFieldValue }) => (
          <>
            <div className={'form-main-title'}>
              <strong className={'info-title'}>图表信息</strong>
              <span
                className={'option-reset'}
                onClick={() => {
                  setOption({ ...option, ...INIT_OPTION });
                  setFieldValue('group', undefined);
                  setFieldValue('cluster', undefined);
                }}
              >
                重置图表
              </span>
            </div>
            <FormField label={'图表展示类型'} name="type">
              {({ field }) => (
                <>
                  <Select
                    {...field}
                    optionFilterProp="children"
                    onChange={(val: string) => {
                      handleChageType(val);
                      setOption({ ...option, type: val });
                      setFieldValue('type', val);
                    }}
                  >
                    {typeOptions}
                  </Select>
                </>
              )}
            </FormField>
            <FormField label={groupLabel} name="group">
              {({ field }) => (
                <>
                  <Select
                    {...field}
                    value={groupValue}
                    showSearch={true}
                    placeholder="请选择"
                    onChange={(val, opt) => {
                      const { key, name, fieldType } = opt as unknown as CustomFieldProps;
                      setOption({
                        ...option,
                        group: [
                          {
                            key: key,
                            name: name,
                            fieldType: fieldType,
                          },
                        ],
                      });
                      setFieldValue('group', val);
                    }}
                    optionFilterProp="children"
                  >
                    {groupOptions}
                  </Select>
                </>
              )}
            </FormField>
            <FormField label={valueLabel} name="value">
              {({ field }) => (
                <DropdownInput
                  {...field}
                  customFields={numberFields}
                  value={value}
                  onChange={val => {
                    setOption({
                      ...option,
                      value: val,
                    });
                    setFieldValue('value', val);
                  }}
                  mode={type === BASIC_PIE_CHART ? '' : 'multiple'}
                />
              )}
            </FormField>
            {type === BASIC_TABLE_CHART ? (
              <FormField label={valueGroupLabel} name="cluster">
                {({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    // allowClear
                    placeholder="请选择"
                    onChange={(val, opt) => {
                      /**
                       * todo 支持清除功能不生效，原因val，opt undefined，上面select同样的问题
                       */
                      const { key, name, fieldType } = opt as unknown as CustomFieldProps;
                      setOption({
                        ...option,
                        cluster: [
                          {
                            key: key,
                            name: name,
                            fieldType: fieldType,
                          },
                        ],
                      });
                      setFieldValue('cluster', val);
                    }}
                    optionFilterProp="children"
                  >
                    <Select.Option key={'status'} fieldType={'Status'} name="状态" value={'status'}>
                      状态
                    </Select.Option>
                    <Select.Option key={'status1'} fieldType={'Status1'} name="状态1" value={'status1'}>
                      状态1
                    </Select.Option>
                  </Select>
                )}
              </FormField>
            ) : null}

            <div className={'form-main-title'}>
              <strong className={'info-title'}>数据筛选</strong>
              <span
                className={'option-reset'}
                onClick={() => {
                  setFieldValue('iql', '');
                  setOption({ ...option, iql: '' });
                }}
              >
                重置筛选
              </span>
            </div>
            <FormField label={'IQL查询'} name="iql">
              {({ field }) => (
                <TextArea
                  {...field}
                  placeholder="请输入"
                  onChange={e => {
                    setOption({
                      ...option,
                      iql: e.target.value,
                    });
                    setFieldValue('iql', e.target.value);
                  }}
                />
              )}
            </FormField>
          </>
        )}
      </Formik>
    </div>
  );
};

export default Config;
