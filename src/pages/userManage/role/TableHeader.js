import React from 'react';
import { formatDate } from 'util/index.js';
import { Button, Popconfirm } from 'antd';

export const RoleHeaderLabel = (callbackView, callbackEdit, callbackDel) => {
  let data = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'sexStr',
    },
    {
      title: '角色描述',
      dataIndex: 'number',
    },
    {
      title: '备注',
      dataIndex: 'dutyStr',
    },
    {
      title: '操作',
      dataIndex: 'opreation',
      //   width: 200,
      align: 'center',
      render: (text, record, index) => {
        return (
          <div>
            <Button
              type="primary"
              size="small"
              style={{ marginRight: '10px' }}
              onClick={() => callbackEdit && callbackEdit(record)}
            >
              编辑
            </Button>
            <Button
              style={{ marginRight: '10px', backgroundColor: '#67c23a' }}
              onClick={() => callbackResources && callbackResources(record)}
            >
              菜单分配
            </Button>
            <Button
              style={{ marginRight: '10px', backgroundColor: '#e6a23c' }}
              onClick={() => callbackUser && callbackUser(record)}
            >
              分配用户
            </Button>
            <Popconfirm title="确认删除此警员?" onConfirm={() => callbackDel && callbackDel(record, index)}>
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
