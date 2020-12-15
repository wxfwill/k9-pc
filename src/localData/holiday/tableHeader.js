import React from 'react';
export const AttendanceInfor = [
  {
    title: '序号',
    dataIndex: 'id',
    render: (text, record, index) => {
      return <span>{index + 1}</span>;
    },
  },
  {
    title: '人员名称',
    dataIndex: 'userName',
  },
  {
    title: '日期',
    dataIndex: 'clockDate',
    render: (text, record, index) => {
      return <span>{util.formatDate(new Date(text), 'yyyy-MM-dd')}</span>;
    },
  },
  {
    title: '星期',
    dataIndex: 'week',
  },
  {
    title: '部门',
    dataIndex: 'groupName',
  },
  {
    title: '班次',
    dataIndex: 'frequency',
  },
  {
    title: '上班应打卡',
    dataIndex: 'workDate',
  },
  {
    title: '下班应打卡',
    dataIndex: 'offWorkDate',
  },
  {
    title: '上班实际打卡',
    dataIndex: 'workActualDate',
    render: (text, record, index) => {
      return (
        <span style={record.clockType === '迟到' ? { color: 'red' } : {}}>
          {/* {record.clockType === '旷工' ? '--' : text} */}
          {text}
        </span>
      );
    },
  },
  {
    title: '下班实际打卡',
    dataIndex: 'offWorkActualDate',
    render: (text, record, index) => {
      return (
        <span style={record.clockType === '早退' ? { color: 'red' } : {}}>
          {/* {record.clockType === '旷工' ? '--' : text} */}
          {text}
        </span>
      );
    },
  },
  {
    title: '考勤状态',
    dataIndex: 'clockType',
    render: (text, record, index) => {
      return <span style={text !== '正常' ? { color: 'red' } : {}}>{text}</span>;
    },
  },
];
