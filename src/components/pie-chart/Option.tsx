import React, { useMemo } from 'react';
import { Form, Select } from '@osui/ui';
// @ts-ignore
import useParseQuery, { FetchMethod } from 'proxima-sdk/hooks/useParseQuery';
// @ts-ignore
import Parse from 'proxima-sdk/lib/Parse';
// @ts-ignore
import { CustomField } from 'proxima-sdk/schema';

// const TYPE_LIST = [
//   {
//     label: '饼图',
//     value: 'pie',
//   },
// ];

const Option = () => {
  // const { data: _customField } = useParseQuery(new Parse.Query(CustomField), FetchMethod.All);

  // const customFields = useMemo(() => {
  //   return _customField?.length ? _customField.map(c => ({ value: c.key, label: c.name })) : [];
  // }, [_customField]);
  const customFields = []
  return (
    <div>
      <Form layout={'vertical'}>
        <Form.Item label="Form Layout" name="layout">
          <Select>
            {customFields.map(c => (
              <Select.Option key={c.value} value={c.value}>{c.lable}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Option;
