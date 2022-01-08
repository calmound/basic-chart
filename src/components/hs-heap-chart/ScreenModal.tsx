// @ts-nocheck
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { ConfigProps, GroupValue } from '../lib/type';
import Title from 'antd/lib/skeleton/Title';
import { Select } from '@osui/ui';
import { FILTER_EXPRESSIONS } from 'proxima-sdk/lib/Global';
import { cloneDeep } from 'lodash';
import Parse from 'proxima-sdk/lib/Parse';
import { CustomField, FieldType, Workspace } from 'proxima-sdk/schema/models';
import useParseQuery, { FetchMethod } from 'proxima-sdk/hooks/useParseQuery';
import cx from './Config.less';


const ScreenModal: React.FC<> = ({ option, setOption }) => {
  const { group } = option;
  const getData = (component, fieldId) => {
    let selectQuery = component === "Workspace" ? new Parse.Query(Workspace) : new Parse.Query(CustomField).equalTo('objectId', fieldId);
    const { data } = useParseQuery(selectQuery, FetchMethod.All);
    if (data === undefined || !data.length) {
      return false;
    }
    return component === "Workspace" ? data : data[0]?.data?.customData;
  }

  const handleChange = (val, key, type) => {
    const newData = cloneDeep(group);
    newData[key][type] = val;
    setOption({ ...option, group: newData });
  }

  return (
    <div className={cx('screen')}>
      {group?.map((item, index) => {
        const { expression, name, component, fieldId, fieldType, key, spaceVal } = item;
        const data = getData(component, fieldId);
        return (
          <div className={cx('select')}>
            <span>{name}</span>
            <Select
              showSearch
              className={cx('expression')}
              placeholder="请选择条件"
              value={expression}
              onChange={val => {
                handleChange(val, index, 'expression');
              }}
              optionFilterProp="children"
            >
              {component &&
                FILTER_EXPRESSIONS[component] &&
                FILTER_EXPRESSIONS[component].map(expr => {
                  return (
                    <Option key={expr.value} value={expr.value} expression={expr.value}>
                      {expr.label}
                    </Option>
                  );
                })}
            </Select>
            <Select
              showSearch
              className={cx('spaceVal')}
              onChange={(val,opt) => {
                // 此处数据库数据不统一
                handleChange(opt?.id ? opt?.id : opt?.value , index, 'spaceVal');
              }}
              value={spaceVal}
              optionFilterProp="children"
            >
              {
                data ?
                  data?.map(item => {
                    return (
                      // 此处数据库数据不统一
                      <Option key={item.id || item.objectId || item.value} value={item.value || item.objectId}>
                        {item.title || item.name || item.label}
                      </Option>
                    );
                  })
                  : null
              }
            </Select>
            </div>
        )
      })}
    </div>
  )
};

export default ScreenModal;
