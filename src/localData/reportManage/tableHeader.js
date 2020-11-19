import React from 'react';
import { Button } from 'antd';

export const tableHeaderLabel = (editCallback) => {
  let data = [
    {
      title: '人员名称',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '任务时间',
      dataIndex: 'repTime',
      render: (txt, record) => {
        return util.formatDate(new Date(txt), 'yyyy-MM-dd');
      },
    },
    {
      title: '来源',
      dataIndex: 'source',
    },
    {
      title: '任务类型',
      dataIndex: 'category',
    },
    {
      title: '地点',
      dataIndex: 'taskLocation',
    },
    {
      title: '详细情况',
      dataIndex: 'repDetail',
    },
    {
      title: '抓捕人数',
      dataIndex: 'arrestNum',
    },
    {
      title: '是否反馈',
      dataIndex: 'isFeedback',
      render: (txt, record) => {
        return txt == 1 ? '是' : '否';
      },
    },
    {
      title: '反馈详情',
      dataIndex: 'feedbackContext',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'inoption',
      render: (txt, record, index) => {
        return record.repStatus == 'error' ? (
          <Button size="small" type="primary" onClick={() => editCallback && editCallback(record)}>
            编辑
          </Button>
        ) : null;
      },
    },
  ];
  return data;
};

export const ownTableHeaderDetal = [
  {
    title: '任务类型',
    dataIndex: 'category',
  },
  {
    title: '人员名称',
    dataIndex: 'userName',
  },
  {
    title: '任务时间',
    dataIndex: 'repTime',
    render: (txt, record) => {
      return util.formatDate(new Date(txt), 'yyyy-MM-dd');
    },
  },

  {
    title: '任务地点',
    dataIndex: 'taskLocation',
  },
  {
    title: '来源',
    dataIndex: 'sourceNote',
  },
  {
    title: '抓捕人数',
    dataIndex: 'arrestNum',
  },
  {
    title: '详细情况',
    dataIndex: 'repDetail',
  },
];

export const teamTableHeaderDetal = [
  {
    title: '中队名称',
    dataIndex: 'groupName',
  },
  {
    title: '队员姓名',
    dataIndex: 'userNames',
    render: (txt, record) => {
      return txt.join('、');
    },
  },
  {
    title: '任务时间',
    dataIndex: 'repTime',
    render: (txt, record) => {
      return util.formatDate(new Date(txt), 'yyyy-MM-dd');
    },
  },
  {
    title: '任务类型',
    dataIndex: 'category',
    render: (txt, record) => {
      return txt.join();
    },
  },
  {
    title: '任务地点',
    dataIndex: 'taskLocation',
  },
  {
    title: '详细情况',
    dataIndex: 'repDetail',
  },
];

export const dailyInformationDetal = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '人员名称',
    dataIndex: '人员名称',
  },
  {
    title: '汇报时间',
    dataIndex: '汇报时间',
  },
  {
    title: '早晨(7:00-8:00)',
    dataIndex: '早晨(7:00-8:00)',
  },
  {
    title: '上午(9:00-11:30)',
    dataIndex: '上午(9:00-11:30)',
  },
  {
    title: '下午(15:00-18:00)',
    dataIndex: '下午(15:00-18:00)',
  },
  {
    title: '晚上(19:00-22:00)',
    dataIndex: '晚上(19:00-22:00)',
  },
  {
    title: '加分事项',
    dataIndex: '加分事项',
  },
  {
    title: '今日完成加分事项次数',
    dataIndex: '今日完成加分事项次数',
  },
  {
    title: '评论',
    dataIndex: '评论',
  },
];

export const leaveInformationDetal = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '人员名称',
    dataIndex: '人员名称',
  },
  {
    title: '开始时间',
    dataIndex: '开始时间',
  },
  {
    title: '结束时间',
    dataIndex: '结束时间',
  },
  {
    title: '类型',
    dataIndex: '类型',
  },
  {
    title: '请休假目的地',
    dataIndex: '请休假目的地',
  },
  {
    title: '请休假事由',
    dataIndex: '请休假事由',
  },
  {
    title: '审批状态',
    dataIndex: '审批状态',
  },
  {
    title: '审批人',
    dataIndex: '审批人',
  },
  {
    title: '备注',
    dataIndex: '备注',
  },
];

export const OvertimeInformationDetal = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '人员名称',
    dataIndex: '人员名称',
  },
  {
    title: '开始时间',
    dataIndex: '开始时间',
  },
  {
    title: '结束时间',
    dataIndex: '结束时间',
  },
  {
    title: '类型',
    dataIndex: '类型',
  },
  {
    title: '时长',
    dataIndex: '时长',
  },
  {
    title: '事由',
    dataIndex: '事由',
  },
];

export const AwardInformationDetal = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '人员名称',
    dataIndex: '人员名称',
  },
  {
    title: '完成时间',
    dataIndex: '完成时间',
  },
  {
    title: '加分原因',
    dataIndex: '加分原因',
  },
  {
    title: '详细情况',
    dataIndex: '详细情况',
  },
  {
    title: '审批人',
    dataIndex: '审批人',
  },
  {
    title: '审批时间',
    dataIndex: '审批时间',
  },
  {
    title: '备注',
    dataIndex: '备注',
  },
];
