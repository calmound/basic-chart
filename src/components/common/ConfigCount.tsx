// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { Input, Radio, Button, Modal } from '@osui/ui';
import { isEqual, remove } from 'lodash';
import { OverflowTooltip } from 'proxima-sdk/components/Components/Common';

import { ConfigProps, GroupValue } from '../lib/type';
import { ConfigAddIndex } from '.';
const { TextArea } = Input;

/**
 * todo 
 * View样式待调整，detail部分样式调整
 * 展示结果逻辑可能待修改
 * 查询接口可能会更改
 * 未对接口
 * 抽离重复代码
 * 配置项暂未开发
 */
const ConfigCount: React.FC<ConfigProps> = ({ option, setOption }) => {
  const { textAreaValue: _textAreaValue, target: _target, unitName: _unitName, unit: _unit } = option
  const [textAreaValue, setTextAreaValue] = useState(_textAreaValue ? _textAreaValue : '');
  const [isAddIndex, setAddIndex] = useState(false);
  const [target, setTarget] = useState(_target ? _target : []);
  const [addTarget, setAddTarget] = useState({});
  const [unitName, setUnitName] = useState(_unitName ? _unitName : '');
  const [unit, setUnit] = useState(_unit ? _unit : '');

  const handleChange = useCallback(
    e => {
      setTextAreaValue(e.target?.value);
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
    setOption({ ...option, target, unitName, unit, textAreaValue })
  }, [target, unitName, unit, textAreaValue])

  const handleOkProps = () => {
    setAddIndex(false); 
    let isIndex = false;
    // setTarget(target.concat(addTarget));
    target.forEach((item,index) => {
      if(item?.id === addTarget?.id){
        target.splice(index,1,addTarget)
        isIndex = true;
      }
    })
     isIndex ? null : setTarget(target.concat(addTarget)); setAddTarget({})
  }

  return (
    <div>
      <>
        <div>
          <div className={'form-main-title'}>
            <strong className={'info-title'}>指标</strong>
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
          <div>
            {target.map(item =>
              <div className='form-main-target'>
                <OverflowTooltip maxline={1} title={item.targetName} >{item.targetName}</OverflowTooltip>
                <div className='form-main-edit'>
                  <span onClick={() => { setAddTarget(item); setAddIndex(true) }}>编辑</span>
                  <span onClick={() => setAddTarget(remove(target, function (itemDel) { return isEqual(itemDel, item) }))}>删除</span>
                </div>
              </div>
            )}
          </div>
          <Button className='form-add-target' onClick={() => setAddIndex(true)}>+添加指标</Button>
        </div>
        <div>
          <div className={'form-main-title'}>
            <strong className={'info-title'}>展示结果</strong>
          </div>
          <TextArea key="textAreaValue" value={textAreaValue} placeholder="使用【】引用指标，支持进行简单的四则运算(英文半角符号)，例如：【新增需求】+【新增缺陷】" onChange={handleChange} className='form-text-area' />
        </div>
        <div>
          <div className={'form-main-title'}>
            <strong className={'info-title'}>单位</strong>
          </div>
          <div className='form-set-unit'>
            <Input onChange={e => setUnitName(e.target?.value)} value={unitName} />
            <Radio.Group onChange={handleUniteChange}>
              <Radio.Button value="left">左</Radio.Button>
              <Radio.Button value="right">右</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <Button className='form-target-save' onClick={handleSave}>确定</Button>
        {isAddIndex ?
          <Modal className='form-target-modal' title="添加指标" visible={isAddIndex} onOk={handleOkProps} onCancel={() => { setAddIndex(false); setAddTarget({}) }} width={450}>
            <ConfigAddIndex setAddTarget={setAddTarget} addTarget={addTarget} />
          </Modal> : null}
      </>
    </div>
  );
};

export default ConfigCount;
