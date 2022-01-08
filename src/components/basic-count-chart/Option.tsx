// @ts-nocheck
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input, Radio, Button, Modal, InputNumber, message } from '@osui/ui';
import { isEqual, remove, cloneDeep } from 'lodash';
import { OverflowTooltip } from 'proxima-sdk/components/Components/Common';
import { BASIC_COUNT_CHART } from 'proxima-sdk/lib/Global';
import { debounce } from 'lodash';

import { CommonOptionProps } from '../lib/type';
import TargetModal from './TargetModal';
import { Formik } from 'formik';
import { FormField } from 'proxima-sdk/components/Components/Common';
import cx from './option.less';
const { TextArea } = Input;

const Option: React.FC<CommonOptionProps> = ({ option, setOption, setSearchOption }) => {
  const { formula = '', target = [], unitName = '', unit = 'right', precision = 0 } = option;
  const [curTarget, setCurTarget] = useState({}); // 有值表示当前为编辑指标
  const [editTarIndx, setEditTarIndex] = useState(null); // 编辑指标的数组下标
  const [isTargetVisible, setTargetVisible] = useState(false);
  const [addTarget, setAddTarget] = useState({});

  const formulaReg = /^[\+|\-|\*|/|\(|\)|\d]+$/;

  const ref = useRef(null);

  const initialValues = {
    type: BASIC_COUNT_CHART,
    formula,
    precision,
    unit,
    unitName,
  };

  const hanleSubmit = useCallback(() => {
    if (!isFormula(formula)) {
      message.error('请输入正确的运算公式');
      return;
    }
    setSearchOption(option);
  }, [option]);

  const isFormula = useCallback(
    value => {
      let formula = value;
      //将公式中的中文变量名、空格删除，剩余的使用正则匹配
      target.forEach(g => (formula = formula.replace(new RegExp(`【${g.targetName}】`, 'g'), '')));
      formula = formula.replace(/\s/g, '');
      const match = formula.match(formulaReg);
      return Boolean(match?.length);
    },
    [target],
  );

  const handleCancel = useCallback(() => {
    setTargetVisible(false);
    setCurTarget({});
    setEditTarIndex(null);
  });

  const handleOk = useCallback(() => {
    if (editTarIndx) {
      // 编辑，首先判断命名是否重复，不重复是进行数据修改；
      const isNameExist = !!target.filter(
        item => item?.id !== curTarget?.id && item.targetName === addTarget?.targetName,
      ).length;
      if (isNameExist) {
        return message.error('指标名称重复！');
      }
      const _target = cloneDeep(target);
      _target[editTarIndx] = curTarget;
      setOption({ ...option, target: _target });
    } else {
      const isNameExist = !!target.filter(item => item.targetName === addTarget?.targetName).length;
      if (isNameExist) {
        return message.error('指标名称重复！');
      }

      // 不为编辑且指标名称不重复的时候判断为正常新增
      setOption({ ...option, target: target.concat(curTarget) });
      setTargetVisible(false);
    }

    handleCancel();
  }, [option, target, curTarget, handleCancel]);

  return (
    <div>
      <Formik innerRef={ref} initialValues={initialValues} onSubmit={() => {}}>
        {({ setFieldValue }) => (
          <>
            <FormField name="target" label="指标">
              {({ field }) => (
                <div>
                  {/* <div className={cx('form-main-title')}>
                    <strong className={cx('info-title')}>指标</strong> */}
                  {/* <span
                className={'option-reset'}
                onClick={() => {
                  setOption({ ...option, ...INIT_OPTION });
                  setFieldValue('group', undefined);
                  setFieldValue('cluster', undefined);
                }}
              >
                重置图表
              </span> */}
                  {/* </div> */}
                  <div {...field}>
                    {target.map((item, index) => (
                      <div className={cx('form-main-target')}>
                        <OverflowTooltip maxline={1} title={item.targetName}>
                          {item.targetName}
                        </OverflowTooltip>
                        <div className={cx('form-main-edit')}>
                          <span
                            onClick={() => {
                              setTargetVisible(true);
                              setCurTarget(item);
                              setEditTarIndex(index);
                            }}
                          >
                            编辑
                          </span>
                          <span
                            onClick={() => {
                              setOption({
                                ...option,
                                target: target.filter(k => item.id !== k.id),
                              });
                            }}
                          >
                            删除
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={cx('form-add-target')}
                    onClick={() => {
                      setTargetVisible(true);
                    }}
                  >
                    +添加指标
                  </Button>
                </div>
              )}
            </FormField>
            <FormField name="formula" label="展示结果">
              {({ field }) => (
                <div className={cx('text-area-div')}>
                  <TextArea
                    {...field}
                    key="formula"
                    value={formula}
                    placeholder="使用【】引用指标，支持进行简单的四则运算(英文半角符号)，例如：【新增需求】+【新增缺陷】"
                    onInput={e => {
                      setFieldValue('formula', e.target.value);
                      setOption({ ...option, formula: e.target.value });
                    }}
                    className={cx('form-text-area')}
                  />
                </div>
              )}
            </FormField>
            <FormField name="precision" label="保留小数位数">
              {({ field }) => (
                <div>
                  <InputNumber
                    {...field}
                    parser={value => `$ ${value}`.replace(/[^\d]/g, '')}
                    formatter={value => value.replace(/[^\d]/g, '')}
                    min={0}
                    placeholder="请输入保留位数"
                    value={precision}
                    onChange={value => {
                      setPrecision(value);
                      setOption({ ...option, precision: value });
                    }}
                  />
                </div>
              )}
            </FormField>
            <FormField name="unit" label="单位">
              {({ field }) => (
                <div>
                  <div className={cx('form-set-unit')}>
                    <Input
                      {...field}
                      onChange={e => {
                        setFieldValue('unitName', e.target.value);
                        setOption({ ...option, unitName: e.target.value });
                      }}
                      value={unitName}
                    />
                    <Radio.Group
                      onChange={e => {
                        setFieldValue('unit', e.target.value);
                        setOption({ ...option, unit: e.target.value });
                      }}
                    >
                      <Radio.Button value="left">左</Radio.Button>
                      <Radio.Button value="right">右</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              )}
            </FormField>
          </>
        )}
      </Formik>
      <Button className={cx('form-target-save')} onClick={hanleSubmit}>
        查询
      </Button>
      {isTargetVisible ? (
        <Modal
          className={cx('form-target-modal')}
          title="添加指标"
          visible={isTargetVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={450}
        >
          <TargetModal setTarget={setCurTarget} target={curTarget} />
        </Modal>
      ) : null}
    </div>
  );
};

export default Option;
