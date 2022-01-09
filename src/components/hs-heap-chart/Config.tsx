// @ts-nocheck
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Input, Modal, Select } from '@osui/ui';
import { Formik } from 'formik';

import { DropdownInput } from 'proxima-sdk/components/Components/Chart';

import { FormField } from 'proxima-sdk/components/Components/Common';

import {
  BASIC_LINE_CHART,
  BASIC_PIE_CHART,
  FIELD_TYPE_KEY_MAPPINGS,
  INIT_CHART_GROUP_LINE_VALUE,
  INIT_CHART_GROUP_VALUE,
  HS_HEAP_CHART
} from 'proxima-sdk/lib/Global';

import { CustomField, FieldType } from 'proxima-sdk/schema/models';

import Parse from 'proxima-sdk/lib/Parse';
import { CustomField as CustomFieldProps } from 'proxima-sdk/schema/types/models';
import useParseQuery, { FetchMethod } from 'proxima-sdk/hooks/useParseQuery';
import { FilterQuery } from 'proxima-sdk/components/Components/Chart'

import { CHART_TYPE_INFO, INIT_OPTION } from '../lib/global';

import { CommonOptionProps, GroupValue } from '../lib/type';
import cx from './Config.less';
import ScreenModal from './ScreenModal';
const { TextArea } = Input;

const { Number, User, Dropdown, ItemType, Status, Date, CreatedAt, UpdatedAt, Radio, Checkbox, Tree, Workspace } = FIELD_TYPE_KEY_MAPPINGS;

/**
 * todo.....
 * option 回显后续在验证
 * value 搜索有问题
 * 下拉value是数组，所以需要使用Dropdown
 * table 等待新后端结构，然后适配
 */
const Config: React.FC<CommonOptionProps> = ({ option, setOption, handleChageType }) => {
  const { type, group, value, cluster, iql, screen } = option;
  const [visible, setVisible] = useState(false);
  const [oldGroup, setOldGroup] = useState({});

  // 获取数据源类型的自定义字段
  let selectQuery = new Parse.Query(CustomField).include('fieldType');
  selectQuery = selectQuery.matchesQuery(
    'fieldType',
    new Parse.Query(FieldType).containedIn('key', [Radio, Checkbox, Dropdown, Tree, Workspace]),
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


  // 下拉类型的字段
  const groupOptions = useMemo(() => {
    return _xData?.length
      ? _xData.map(c => (
        <Select.Option
          value={c.key}
          key={c.key}
          component={c.fieldType.component}
          fieldtype={c.fieldType?.objectId}
          name={c.name}
          fieldid={c.objectId}
        >
          {c.name}
        </Select.Option>
      ))
      : [];
  }, [_xData]);

  const { groupLabel, valueLabel, valueGroupLabel } = CHART_TYPE_INFO[type];
  const ref = useRef(null);

  const initialValues = {
    type: HS_HEAP_CHART,
    group: group?.length ? (group[0] as GroupValue)?.key : undefined,
    value: value,
    cluster: cluster?.length ? (cluster[0] as GroupValue)?.key : undefined,
    iql: iql,
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
      group.forEach(item => {
        return item.name;
      });
    }
    return undefined;
  }, [group]);



  return (
    <div>
      <Formik innerRef={ref} initialValues={initialValues} onSubmit={() => { }}>
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
                      // 切换类型为折线，group=创建日期
                      // 当前图表是折线，切换为其他类型图表，group=事项类型
                      const _group =
                        val === BASIC_LINE_CHART
                          ? INIT_CHART_GROUP_LINE_VALUE
                          : type === BASIC_LINE_CHART
                            ? INIT_CHART_GROUP_VALUE
                            : group;
                      handleChageType(val);
                      setOption({ ...option, type: val, group: _group, cluster: [] });
                      setFieldValue('type', val);
                    }}
                  >
                    {typeOptions}
                  </Select>
                </>
              )}
            </FormField>
            <div className={cx('group')}>
              <span
                className={cx('screen')}
                onClick={() => {
                  setVisible(true);
                }}
              >
                筛选
              </span>
              <FormField label={groupLabel} name="group">
                {({ field }) => (
                  <>
                    <Select
                      {...field}
                      mode="multiple"
                      value={groupValue}
                      showSearch={true}
                      placeholder="请选择"
                      onChange={(val, opt) => {
                        console.log('%c [ opt ]-200', 'font-size:13px; background:pink; color:#bf2c9f;', opt)
                        setOption({
                          ...option,
                          group: opt,
                        });
                        setFieldValue('group', val);
                        setOldGroup(opt);
                      }}
                      optionFilterProp="children"

                    >
                      {groupOptions}
                    </Select>
                  </>
                )}
              </FormField>
            </div>
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

            <div style={{ height: '16px' }}></div>

            <div className={'form-main-title'}>
              <strong className={'info-title'}>数据筛选</strong>
              <span
                className={'option-reset'}
                onClick={() => {
                  setFieldValue('iql', '');
                  setOption({ ...option, iql: '', selectors: {} });
                }}
              >
                重置筛选
              </span>
            </div>
            {/* <FormField label={'IQL查询'} name="iql">
              {({ field }) => (
                <TextArea
                  {...field}
                  placeholder="请输入"
                  onChange={e => {
                    setIqlValue(e);
                    setFieldValue('iql', e.target.value)
                  }}
                />
              )}
            </FormField> */}
            <FilterQuery
              setOption={setOption}
              option={option}
            />
            {
              visible ?
                <Modal
                  visible={visible}
                  onOk={() => setVisible(false)}
                  onCancel={() => { setVisible(false); setOption({ ...option, group: oldGroup }) }}
                  title="筛选"
                >
                  <ScreenModal group={group} option={option} setOption={setOption} />
                </Modal>
                : null
            }

          </>
        )}
      </Formik>
    </div>
  );
};

export default Config;
