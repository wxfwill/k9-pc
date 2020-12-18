import React from 'react';
import { Button } from 'antd';

export const tableHeaderLabel = (editCallback) => {
  let data = [
    {
      title: '姓名',
      dataIndex: 'applyUser',
      width: 100,
    },
    {
      title: '任务开始时间',
      dataIndex: 'startTime',
      render: (txt, record) => {
        return util.formatDate(new Date(txt), 'yyyy-MM-dd hh:mm:ss');
      },
    },
    {
      title: '任务结束时间',
      dataIndex: 'endTime',
      render: (txt, record) => {
        return util.formatDate(new Date(txt), 'yyyy-MM-dd hh:mm:ss');
      },
    },
    {
      title: '车牌号码',
      dataIndex: 'carNo',
    },
    {
      title: '用车类型',
      dataIndex: 'carUseType',
      width: 100,
    },
    {
      title: '目的地',
      dataIndex: 'carUseDest',
    },
    {
      title: '用车事由',
      dataIndex: 'carUseReason',
    },
    {
      title: '备注',
      dataIndex: 'note',
    },
    // {
    //   title: '操作',
    //   dataIndex: 'inoption',
    //   render: (txt, record, index) => {
    //     return record.repStatus == 'error' ? (
    //       <Button size="small" type="primary" onClick={() => editCallback && editCallback(record)}>
    //         编辑
    //       </Button>
    //     ) : null;
    //   },
    // },
  ];
  return data;
};

export const tableHeaderLabel1 = (editCallback) => {
  let data = [
    {
      title: '姓名',
      dataIndex: 'applyUser',
      width: 100,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (txt, record) => {
        return util.formatDate(new Date(txt), 'yyyy-MM-dd hh:mm:ss');
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (txt, record) => {
        return util.formatDate(new Date(txt), 'yyyy-MM-dd hh:mm:ss');
      },
    },
    {
      title: '用车类型',
      dataIndex: 'taskType',
      width: 100,
    },
    {
      title: '地点',
      dataIndex: 'taskDestLocation',
      width: 120,
    },
    {
      title: '带队民警',
      dataIndex: 'policeLeader',
      width: 100,
    },
    {
      title: '车牌号码',
      dataIndex: 'carNo',
    },
    {
      title: '用车时长',
      dataIndex: 'usedTimeNote',
      width: 120,
    },
    {
      title: '出勤装备',
      dataIndex: 'allEquipment',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'note',
    },
    // {
    //   title: '操作',
    //   dataIndex: 'inoption',
    //   render: (txt, record, index) => {
    //     return record.repStatus == 'error' ? (
    //       <Button size="small" type="primary" onClick={() => editCallback && editCallback(record)}>
    //         编辑
    //       </Button>
    //     ) : null;
    //   },
    // },
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
  // {
  //   title: '抓捕人数',
  //   dataIndex: 'arrestNum',
  // },
  {
    title: '详细情况',
    dataIndex: 'repDetail',
    width: 210,
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
    render: (txt, record, index) => {
      return (record.pageNumber - 1) * 10 + index + 1;
    },
  },
  {
    title: '人员名称',
    dataIndex: 'repUser',
  },
  {
    title: '汇报时间',
    dataIndex: 'repTime',
    render: (txt, record) => {
      return txt ? util.formatDate(new Date(txt), 'yyyy-MM-dd') : '';
    },
  },
  {
    title: '早晨(7:00-8:00)',
    dataIndex: 'morn',
  },
  {
    title: '上午(9:00-11:30)',
    dataIndex: 'forenoon',
  },
  {
    title: '下午(15:00-18:00)',
    dataIndex: 'afternoon',
  },
  {
    title: '晚上(19:00-22:00)',
    dataIndex: 'night',
  },
  // {
  //   title: '加分事项',
  //   dataIndex: 'forenoon',
  // },
  // {
  //   title: '今日完成加分事项次数',
  //   dataIndex: 'repTarget',
  // },
  {
    title: '评论',
    dataIndex: 'comments',
  },
];

export const leaveInformationDetal = (editCallback) => {
  let data = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   render: (txt, row, index) => {
    //     return index + 1;
    //   },
    // },
    {
      title: '申请时间',
      dataIndex: 'leaveDate',
      render: (txt, row, index) => {
        return txt ? util.formatDate(new Date(txt), 'yyyy-MM-dd') : '--';
      },
    },
    {
      title: '请假人',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '请假开始时间',
      dataIndex: 'startDate',
      render: (txt, row, index) => {
        //return util.formatDate(new Date(txt), 'yyyy-MM-dd hh:mm:ss');
        return txt ? util.formatDate(new Date(txt), 'yyyy-MM-dd') : '--';
      },
    },
    {
      title: '请假结束时间',
      dataIndex: 'endDate',
      render: (txt, row, index) => {
        //return util.formatDate(new Date(txt), 'yyyy-MM-dd hh:mm:ss');
        return txt ? util.formatDate(new Date(txt), 'yyyy-MM-dd') : '--';
      },
    },
    {
      title: '请假类型',
      dataIndex: 'leaveType',
      width: 120,
    },
    {
      title: '请假时长',
      dataIndex: 'leaveHours',
      render: (txt, row, index) => {
        return txt ? txt + '小时' : '--';
      },
    },
    {
      title: '目的地',
      dataIndex: 'destination',
    },
    {
      title: '请休假事由',
      dataIndex: 'reason',
      width: 220,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalState',
      render: (txt, recode, index) => {
        return txt && txt.split('-')[1];
      },
    },
    {
      title: '审批人',
      dataIndex: 'approvalUserName',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (txt, record, index) => {
        return record.repStatus == 'error' ? (
          <Button type="primary" size="small" onClick={() => editCallback && editCallback(record)}>
            编辑
          </Button>
        ) : null;
      },
    },
  ];
  return data;
};

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

export const AwardInformationDetal = (editCallback) => {
  let data = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (txt, row, index) => {
        return index + 1;
      },
    },
    {
      title: '人员名称',
      dataIndex: 'userName',
    },
    {
      title: '完成时间',
      dataIndex: 'completeDate',
      render: (txt, row, index) => {
        return util.formatDate(new Date(txt), 'yyyy-MM-dd');
      },
    },
    {
      title: '加分原因',
      dataIndex: 'reason',
    },
    {
      title: '详细情况',
      dataIndex: 'particulars',
    },
    {
      title: '审批人',
      dataIndex: 'approvalUserName',
    },
    {
      title: '审批时间',
      dataIndex: 'approvalDate',
      render: (txt, row, index) => {
        return util.formatDate(new Date(txt), 'yyyy-MM-dd');
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (txt, record, index) => {
        return record.repStatus == 'error' ? (
          <Button type="primary" size="small" onClick={() => editCallback && editCallback(record)}>
            编辑
          </Button>
        ) : null;
      },
    },
  ];
  return data;
};
