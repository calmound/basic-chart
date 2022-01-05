// @ts-nocheck
import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { InputNumber } from '@osui/ui';
import { Formik } from 'formik';
import { FormField } from 'proxima-sdk/components/Components/Common';

import { BASIC_LISTING_CHART } from 'proxima-sdk/lib/Global';

import { FilterQuery } from 'proxima-sdk/components/Components/Chart'
import { ColumnsSettings } from 'proxima-sdk/components/Components/Common';
import { useTableColumns } from 'proxima-sdk/components/Components/Views';

import { ConfigProps, GroupValue } from '../lib/type';
import { ITEM_LIST_OPTION } from '../lib/global'
import cx from './ListOption.less';

/**
 * todo
 * 输入框只能输入数字
 * 样式微调
 * 接口是否修改
 * view样式还未修改
 * 如何保存selectedColumns
 */

const ListOption: React.FC<ConfigProps> = ({ option, setOption, workspace }) => {
	const { type, cluster, iql, dataNumber: _dataNumber } = option;
	//全局不需要workspace
	const { customFields, selectedColumns, columns, setColumns } = useTableColumns('default', workspace ? workspace : null);

	const [dataNumber, setDataNumber] = useState(_dataNumber ? _dataNumber : 10);
	const ref = useRef(null);

	const initialValues = {
		type: BASIC_LISTING_CHART,
		// group: group?.length ? (group[0] as GroupValue)?.key : undefined,
		// value: value,
		cluster: cluster?.length ? (cluster[0] as GroupValue)?.key : undefined,
		iql: iql,
	};

	const handleOnChange = (value) => {
		setDataNumber(value)
	}

	// useEffect(()=>{
	// 	setOption(...option, dataNumber)
	// }, [dataNumber])

	useEffect(()=>{
		setOption({...option, selectedColumns, dataNumber})
	}, [selectedColumns, dataNumber])

	useEffect(()=>{
		setDataNumber(_dataNumber ? _dataNumber : 10)
	},[ option?.dataNumber ])

	const handleColumnChange = useCallback(
		columns => {
			const columnKeys = columns.filter(c => !c.isHidden).map(c => c.key);
			setColumns(columnKeys);
		},
		[setColumns],
	);

	return (
		<div>
			<Formik innerRef={ref} initialValues={initialValues} onSubmit={() => { }}>
				{({ setFieldValue }) => (
					<>
						<div className={('form-main-title')}>
							<strong className={'info-title'}>图表信息</strong>
							<span
								className={'option-reset'}
								onClick={() => {
									  setOption({ ...option, ...ITEM_LIST_OPTION });
										setFieldValue('DataNumber',10)
								}}
							>
								重置图表
							</span>
						</div>
						<FormField name="DataNumber">
							{({ field }) => (
								<>
									<div>
										<div>每页结果数(最多50条)</div>
										<InputNumber
											{...field}
											parser={value => `$ ${value}`.replace(/[^\d]/g, '')}
											formatter={value => value.replace(/[^\d]/g, '')}
											min={10}
											placeholder='请输入结果数'
											value={dataNumber}
											onChange={handleOnChange}
											style={{ width: '100%' }}
										/>
									</div>
								</>
							)}

						</FormField>
						<FormField name="ColumnsList">
							{({ }) => (
								<>
									<div className={cx('form-columns-title')}>
										<ColumnsSettings
											titleText='显示列'
											customColumns={columns}
											setColumnSettings={handleColumnChange}
										/>
									</div>
								</>
							)}

						</FormField>
						<div style={{ height: '16px' }}></div>

						<div className={'form-main-title'}>
							<strong className={'info-title'}>数据筛选</strong>
							<span
								className={'option-reset'}
								onClick={() => {
									//   setFieldValue('iql', '');
									setOption({ ...option, iql: '', selectors: {}, selectedColumns });
								}}
							>
								重置筛选
							</span>
						</div>
						<FilterQuery
							setOption={setOption}
							option={option}
						/>
					</>
				)}
			</Formik>
		</div>
	);
};

export default ListOption;
