import React from 'react';
import { formatDate } from 'util/index.js';
import { Button, Popconfirm } from 'antd';

export const userHeaderLabel = (callbackView, callbackEdit, callbackDel) => {
  let data = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sexStr',
    },
    {
      title: '警员编号',
      dataIndex: 'number',
    },
    {
      title: '职务',
      dataIndex: 'dutyStr',
    },
    {
      title: '职称',
      dataIndex: 'titleStr',
    },
    {
      title: '工作单位',
      dataIndex: 'workUnit',
    },
    {
      title: '电话',
      dataIndex: 'telPhone',
    },
    {
      title: '操作',
      dataIndex: 'opreation',
      width: 200,
      align: 'center',
      render: (text, record, index) => {
        return (
          <div>
            <Button size="small" onClick={() => callbackView && callbackView(record)}>
              查看
            </Button>
            <Button
              type="primary"
              size="small"
              style={{ margin: '0 10px' }}
              onClick={() => callbackEdit && callbackEdit(record)}
            >
              编辑
            </Button>

            <Popconfirm title="确认删除此警员?" onConfirm={() => callbackDel && callbackDel(record, index)}>
              {/* <span style={{ cursor: 'pointer', color: '#1890ff' }}>
                <Icon type="delete" style={{ margin: '0 10px' }} />
                删除
              </span> */}
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return data;
};

export const archivesHeaderLabel = (callbackViewArchive) => {
  let data = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sexStr',
    },
    {
      title: '警员编号',
      dataIndex: 'number',
    },
    {
      title: '职务',
      dataIndex: 'dutyStr',
    },
    {
      title: '职称',
      dataIndex: 'titleStr',
    },
    {
      title: '工作单位',
      dataIndex: 'workUnit',
    },
    {
      title: '电话',
      dataIndex: 'telphone',
    },
    {
      title: '操作',
      dataIndex: 'opreation',
      width: 200,
      align: 'center',
      render: (text, record, index) => {
        return (
          <div>
            <Button size="small" type="primary" onClick={() => callbackViewArchive && callbackViewArchive(record)}>
              查看档案
            </Button>
          </div>
        );
      },
    },
  ];
  return data;
};
