// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { Input, Radio, Button, Modal, InputNumber } from '@osui/ui';
import { isEqual, remove } from 'lodash';
import { OverflowTooltip } from 'proxima-sdk/components/Components/Common';

import { ConfigProps, GroupValue } from '../lib/type';
import TargetModal from './TargetModal';
import cx from './option.less';
const { TextArea } = Input;

/**
 * todo 
 * View样式待调整，detail部分样式调整
 * 展示结果过滤，只保留四则运算部分，正则
 * 配置项暂未开发
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

  const handleChange = useCallback(
    e => {
      setFormula(e.target?.value);
    },
    [],
  );
  const handleUniteChange = e => {
    /**
     * 单位左右，默认点击确定时生效
     */
    setUnit(e.target.value)
    // setOption({...option, unit:e.target.value})
  };
  const handleSave = useCallback(() => {
    setOption({ ...option, target, unitName, unit, formula, precision })
  }, [target, unitName, unit, formula, precision, option])

  const handleOnChange = (value) => {
    setPrecision(value);
  }

  const handleOkProps = () => {
    setAddIndex(false);
    let isIndex = false;
    // setTarget(target.concat(addTarget));
    target.forEach((item, index) => {
      if (item?.id === addTarget?.id) {
        target.splice(index, 1, addTarget)
        isIndex = true;
      }
    })
    isIndex ? null : setTarget(target.concat(addTarget)); setAddTarget({})
  }

  return (
    <div>
      <div>
        <div className={cx('form-main-title')}>
          <strong className={cx('info-title')}>指标</strong>
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
        </div>

        {target.map(item =>
          <div className={cx('form-main-target')}>
            <OverflowTooltip maxline={1} title={item.targetName} >{item.targetName}</OverflowTooltip>
            <div className={cx('form-main-edit')}>
              <span onClick={() => { setAddTarget(item); setAddIndex(true) }}>编辑</span>
              <span onClick={() => setAddTarget(remove(target, function (itemDel) { return isEqual(itemDel, item) }))}>删除</span>
            </div>
          </div>
        )}

        <Button className={cx('form-add-target')} onClick={() => { setAddIndex(true) }}>+添加指标</Button>
      </div>
      <div className={cx('text-area-div')}>
        <div className={cx('form-main-title')}>
          <strong className={cx('info-title')}>展示结果</strong>
        </div>
        <TextArea key="formula" value={formula} placeholder="使用【】引用指标，支持进行简单的四则运算(英文半角符号)，例如：【新增需求】+【新增缺陷】" onChange={handleChange} className={cx('form-text-area')} />
      </div>
      <div>
        <div className={cx('form-main-title')}><strong className={cx('info-title')}>保留小数位数</strong></div>
        <InputNumber
          parser={value => `$ ${value}`.replace(/[^\d]/g, '')}
          formatter={value => value.replace(/[^\d]/g, '')}
          min={0}
          placeholder='请输入保留位数'
          value={precision}
          onChange={handleOnChange}
          style={{ width: '100%', margin: '10px 0' }}
        />
      </div>
      <div>
        <div className={cx('form-main-title')}>
          <strong className={cx('info-title')}>单位</strong>
        </div>
        <div className={cx('form-set-unit')}>
          <Input onChange={e => setUnitName(e.target?.value)} value={unitName} />
          <Radio.Group onChange={handleUniteChange}>
            <Radio.Button value="left">左</Radio.Button>
            <Radio.Button value="right">右</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <Button className={cx('form-target-save')} onClick={handleSave}>确定</Button>
      {isAddIndex ?
        <Modal className={cx('form-target-modal')} title="添加指标" visible={isAddIndex} onOk={handleOkProps} onCancel={() => { setAddIndex(false); setAddTarget({}) }} width={450}>
          <TargetModal setAddTarget={setAddTarget} addTarget={addTarget} />
        </Modal> : null}
    </div>
  );
};

export default CountOption;
