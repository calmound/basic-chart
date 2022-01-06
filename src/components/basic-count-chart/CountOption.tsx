// @ts-nocheck
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input, Radio, Button, Modal, InputNumber, message } from '@osui/ui';
import { isEqual, remove } from 'lodash';
import { OverflowTooltip } from 'proxima-sdk/components/Components/Common';
import { BASIC_COUNT_CHART } from 'proxima-sdk/lib/Global';
import { debounce } from 'lodash';

import { ConfigProps, GroupValue } from '../lib/type';
import TargetModal from './TargetModal';
import { Formik } from 'formik';
import { FormField } from 'proxima-sdk/components/Components/Common';
import cx from './option.less';
const { TextArea } = Input;

/**
 * todo 
 * initialValues 替换 state
 */
const CountOption: React.FC<ConfigProps> = ({ option, setOption }) => {
  const { formula: _formula, target: _target, unitName: _unitName, unit: _unit, precision: _precision } = option
  const [formula, setFormula] = useState(_formula ? _formula : '');
  const [isAddIndex, setAddIndex] = useState(false);
  const [target, setTarget] = useState(_target ? _target : []);
  const [addTarget, setAddTarget] = useState({});
  const [unitName, setUnitName] = useState(_unitName ? _unitName : '');
  const [unit, setUnit] = useState(_unit ? _unit : '');
  const [precision, setPrecision] = useState(_precision ? _precision : '');
  const formulaReg = /^[\+|\-|\*|/|\(|\)|\d]+$/;
  const [isEdit, setIsEdit] = useState(false);

  const ref = useRef(null);

  const initialValues = {
    type: BASIC_COUNT_CHART,
    formula: _formula ? _formula : '',
    precision: _precision ? _precision : '',
    unit: _unit ? _unit : '',
    unitName: _unitName ? _unitName : '',
  };

  // const handleChange = useCallback(
  //   e => {
  //     // setFormula(e.target?.value);
  //     // setOption({ ...option, formula: e.target?.value })
  //     formulaDebounce(e.target?.value);
  //   },
  //   [],
  // );
  const handleUniteChange = e => {
    /**
     * 单位左右，默认点击确定时生效
     */
    setUnit(e.target.value)
    // setOption({...option, unit:e.target.value})
  };
  const handleSave = useCallback(() => {
    if (!isFormula(formula)) {
      message.error("请输入正确的运算公式");
      return;
    }
    setOption({ ...option, target, unitName, unit, formula, precision })
  }, [target, unitName, unit, formula, precision, option])

  // const handleOnChange = (value) => {
  //   setPrecision(value);
  //   setFieldValue('precision', value)
  //   // setOption({ ...option, precision: value })
  // }


  const isFormula = useCallback((value) => {
    let formula = value;
    //将公式中的中文变量名、空格删除，剩余的使用正则匹配
    target.forEach(g => (formula = formula.replace(new RegExp(`【${g.targetName}】`, 'g'), '')));
    formula = formula.replace(/\s/g, '');
    const match = formula.match(formulaReg);
    return Boolean(match?.length);
  }, [target])

  /**
   * 此处防抖有bug
   */
  // const formulaDebounce = debounce(data => {
  //   if (!isFormula(data)) {
  //     message.error("请输入正确的运算公式")
  //   }
  // }, 100);

  const handleEdit = useCallback(() => {
    // 为编辑时，首先判断命名是否重复，不重复是进行数据修改；
    const data = target
    let isEditName = false;
    target.forEach((item) => {
      if (item?.id !== addTarget?.id) {
        if (item.targetName === addTarget?.targetName) {
          message.error("指标名称重复！")
          isEditName = true;
        }
      }
    });
    target.forEach((item, index) => {
      if (item?.id === addTarget?.id && !isEditName) {
        data[index] = addTarget;
        // target.splice(index, 1, addTarget);
        setTarget(data);
        setIsEdit(false);
        setAddIndex(false);
        setAddTarget({})
      }
    })
  }, [target, addTarget])

  const handleOkProps = useCallback(() => {
    let isIndex = false;
    let isTargetName = false
    if (isEdit) {
      handleEdit()
    } else {
      // isIndex为false 即新增，判断名称是否重复
      target.forEach(item => {
        if (item.targetName === addTarget?.targetName) {
          message.error("指标名称重复！")
          isTargetName = true;
        }
      });
      // 不为编辑且指标名称不重复的时候判断为正常新增
      isTargetName ? null : setTarget(target.concat(addTarget))
      // 
      setAddIndex(!isTargetName ? false : true);
      !isTargetName ? setAddTarget({}) : null;

    }

  }, [target, addTarget, isEdit])

  return (
    <div>
      <Formik innerRef={ref} initialValues={initialValues} onSubmit={() => { }}>
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
                    {target.map(item =>
                      <div className={cx('form-main-target')}>
                        <OverflowTooltip maxline={1} title={item.targetName} >{item.targetName}</OverflowTooltip>
                        <div className={cx('form-main-edit')}>
                          <span onClick={() => { setAddTarget(item); setAddIndex(true); setIsEdit(true) }}>编辑</span>
                          <span onClick={() => setAddTarget(remove(target, function (itemDel) { return isEqual(itemDel, item) }))}>删除</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button className={cx('form-add-target')} onClick={() => { setAddIndex(true);setIsEdit(false) }}>+添加指标</Button>
                </div>
              )}
            </FormField>
            <FormField name="formula" label="展示结果">
              {({ field }) => (
                <div className={cx('text-area-div')}>
                  {/* <div className={cx('form-main-title')}>
                    <strong className={cx('info-title')}>展示结果</strong>
                  </div> */}
                  <TextArea {...field} key="formula" value={formula} placeholder="使用【】引用指标，支持进行简单的四则运算(英文半角符号)，例如：【新增需求】+【新增缺陷】" onInput={(e) => {
                    setFormula(e.target?.value);
                    setFieldValue('formula', e.target?.value)
                  }} className={cx('form-text-area')} />
                </div>
              )}
            </FormField>
            <FormField name="precision" label="保留小数位数">
              {({ field }) => (
                <div>
                  {/* <div className={cx('form-main-title')}><strong className={cx('info-title')}>保留小数位数</strong></div> */}
                  <InputNumber
                    {...field}
                    parser={value => `$ ${value}`.replace(/[^\d]/g, '')}
                    formatter={value => value.replace(/[^\d]/g, '')}
                    min={0}
                    placeholder='请输入保留位数'
                    value={precision}
                    onChange={(value) => {
                      setPrecision(value);
                      setFieldValue('precision', value)
                    }}
                    style={{ width: '100%', margin: '10px 0' }}
                  />
                </div>
              )}
            </FormField>
            <FormField name="unit" label="单位">
              {({ field }) => (
                <div>
                  {/* <div className={cx('form-main-title')}>
                    <strong className={cx('info-title')}>单位</strong>
                  </div> */}
                  <div className={cx('form-set-unit')}>
                    <Input {...field} onChange={e => {
                      setUnitName(e.target?.value); setFieldValue('unitName', e.target?.value)
                    }} value={unitName} />
                    <Radio.Group onChange={(e) => {
                      setUnit(e.target.value)
                      setFieldValue('unit', e.target?.value)
                    }}>
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
      <Button className={cx('form-target-save')} onClick={handleSave}>确定</Button>
      {isAddIndex ?
        <Modal className={cx('form-target-modal')} title="添加指标" visible={isAddIndex} onOk={handleOkProps} onCancel={() => { setAddIndex(false); setAddTarget({}) }} width={450}>
          <TargetModal setAddTarget={setAddTarget} addTarget={addTarget} />
        </Modal> : null}
    </div>
  );
};

export default CountOption;
