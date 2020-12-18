import React, { Component } from 'react';
import { Button, Tag, Popconfirm } from 'antd';
const dicType = (key) => {
  let obj = {
    button: '按钮-#2db7f5',
    dir: '目录-#87d068',
    menu: '菜单-#108ee9',
    api: '接口-#e6a23c',
    root: '根节点-#f50',
  };
  let arr = [],
    res = {};
  if (obj[key]) {
    arr = obj[key].split('-');
    res = { title: arr[0], color: arr[1] };
  }
  return res;
};
export const menuOperate = (addCallback, editCallback, deleteCallback) => {
  let data = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      width: 200,
      align: 'left',
      key: 'name',
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      align: 'center',
      key: 'type',
      render: (txt) => {
        let item = dicType(txt);
        return <Tag color={item.color}>{item.title}</Tag>;
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      key: 'sort',
    },
    {
      title: '菜单地址',
      align: 'center',
      dataIndex: 'url',
      width: '30%',
      key: 'url',
    },
    {
      title: '是否启用',
      align: 'center',
      dataIndex: 'available',
      key: 'available',
      render: (txt, row) => {
        return row.available ? <Tag color="#108ee9">是</Tag> : <Tag color="#f50">否</Tag>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      width: '30%',
      key: 'option',
      render: (txt, row) => {
        return (
          <div>
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                return addCallback && addCallback(row);
              }}
            >
              新增
            </Button>
            <Button
              size="small"
              style={{ margin: '0 10px', background: '#87d068', color: '#fff' }}
              onClick={(e) => {
                e.stopPropagation();
                return editCallback && editCallback(row);
              }}
            >
              编辑
            </Button>
            {row.type != 'root' ? (
              <Button
                type="danger"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  return deleteCallback && deleteCallback(row);
                }}
              >
                删除
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];
  return data;
};
