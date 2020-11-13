import React from 'react';
import { formatDate } from 'util/index.js';

//积分规则周期
export const IntegralRuleCycleEnum = [
  { value: 'month', label: '月' },
  { value: 'day', label: '天' },
  { value: 'hour', label: '小时' },
  { value: 'everyTime', label: '次' },
];

//加减分
export const IntegralOperationEnum = [
  { value: 'add', label: '加' },
  { value: 'sub', label: '减' },
];

export const performanceHeaderLabel = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 70,
  },
  {
    title: '人员名称',
    dataIndex: 'userName',
    width: 100,
  },
  {
    title: '中队',
    dataIndex: 'squadronName',
    width: 100,
  },
  {
    title: '上报时间',
    dataIndex: 'reportingDate',
    width: 150,
    render: (txt) => {
      return formatDate(new Date(txt), 'yyyy-MM-dd');
    },
  },
  {
    title: '自评分数',
    dataIndex: 'selfEvaluationSumMark',
    width: 100,
  },
  {
    title: '中队评分',
    dataIndex: 'businessSquadronSumMark',
    width: 100,
  },
  {
    title: '加减分原因',
    dataIndex: 'valueSquadronSumMark',
    width: 120,
  },
  {
    title: '最终总分',
    dataIndex: 'gmtModified',
    width: 100,
  },
  {
    title: '是否提交自评表',
    dataIndex: 'submitState',
    render: (txt) => {
      return txt == 1 ? '已提交' : '未提交';
    },
  },
  {
    title: '审批状态',
    dataIndex: 'approvalState',
    render: (txt) => {
      return txt == 1 ? '未审批' : txt == 2 ? '审批中' : '已完成';
    },
  },
  {
    title: '操作',
    dataIndex: '备注',
    width: 120,
    fixed: 'right',
    render: () => {
      return (
        <div>
          <span>查看详情</span>
          <span>审批</span>
        </div>
      );
    },
  },
];
