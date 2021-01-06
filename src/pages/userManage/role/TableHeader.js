import React from 'react';
import {Button, Popconfirm} from 'antd';

export const RoleHeaderLabel = (callbackEdit, callbackResources, callbackDel) => {
  const data = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode'
    },
    {
      title: '角色描述',
      dataIndex: 'description'
    },
    {
      title: '备注',
      dataIndex: 'dutyStr'
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
              style={{marginRight: '10px'}}
              onClick={() => callbackEdit && callbackEdit(record)}>
              编辑
            </Button>
            <Button
              size="small"
              style={{marginRight: '10px', backgroundColor: '#67c23a', color: '#fff'}}
              onClick={() => callbackResources && callbackResources(record)}>
              菜单分配
            </Button>
            {/* <Button
              size="small"
              style={{ marginRight: '10px', backgroundColor: '#e6a23c', color: '#fff' }}
              onClick={() => callbackUser && callbackUser(record)}
            >
              分配用户
            </Button> */}
            <Popconfirm title="确认删除此警员?" onConfirm={() => callbackDel && callbackDel(record, index)}>
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
  return data;
};
