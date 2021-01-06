import React, {useState} from 'react';
import {formatDate} from 'util/index.js';
import {Button} from 'antd';

//积分规则周期
export const IntegralRuleCycleEnum = [
  {value: 'month', label: '月'},
  {value: 'day', label: '天'},
  {value: 'hour', label: '小时'},
  {value: 'everyTime', label: '次'}
];

//加减分
export const IntegralOperationEnum = [
  {value: 'add', label: '加'},
  {value: 'sub', label: '减'}
];

export const PerHeaderLabel = (callbackDetal, callbackApproval) => {
  const data = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 70,
      render: (txt, recode, index) => {
        return index + 1;
      }
    },
    {
      title: '人员名称',
      dataIndex: 'userName',
      width: 100
    },
    {
      title: '中队',
      dataIndex: 'squadronName',
      width: 100
    },
    {
      title: '上报时间',
      dataIndex: 'reportingDate',
      width: 150,
      render: (txt) => {
        return formatDate(new Date(txt), 'yyyy-MM-dd');
      }
    },
    {
      title: '自评分数',
      dataIndex: 'selfSumMark',
      width: 100
    },
    {
      title: '中队评分',
      dataIndex: 'squadronSumMark',
      width: 100
    },
    {
      title: '加减分原因',
      dataIndex: 'performanceOtherReasonsDOS',
      width: 120
      // render: (txt, row, index) => {
      //   return txt && txt
      // }
    },
    {
      title: '最终总分',
      dataIndex: 'selfEvaluationSumMark',
      width: 100
    },
    {
      title: '是否提交自评表',
      dataIndex: 'submitState',
      render: (txt) => {
        return txt == 1 ? '已提交' : '未提交';
      }
    },
    {
      title: '审批状态',
      dataIndex: 'approvalState',
      render: (txt) => {
        return txt == 1 ? '未审批' : txt == 2 ? '审批中' : '已完成';
      }
    },
    {
      title: '操作',
      dataIndex: '备注',
      width: 180,
      align: 'center',
      fixed: 'right',
      render: (txt, record) => {
        return (
          <div>
            <Button
              type="primary"
              size="small"
              onClick={() => callbackDetal && callbackDetal(record)}
              style={{marginRight: '10px'}}>
              查看详情
            </Button>
            {record.approvalState == 1 ? (
              <Button type="danger" size="small" onClick={() => callbackApproval && callbackApproval(record)}>
                审批
              </Button>
            ) : null}
          </div>
        );
      }
    }
  ];
  return data;
};
