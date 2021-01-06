import React, {Component} from 'react';
import {Button, Tag, Popconfirm} from 'antd';
const dicType = (key) => {
  const obj = {
    button: '按钮-#2db7f5',
    dir: '目录-#87d068',
    menu: '菜单-#108ee9',
    api: '接口-#e6a23c',
    root: '根节点-#f50'
  };
  let arr = [];
  let res = {};
  if (obj[key]) {
    arr = obj[key].split('-');
    res = {title: arr[0], color: arr[1]};
  }
  return res;
};
export const menuOperate = (editCallback, deleteCallback) => {
  const data = [
    {
      title: '参数名',
      dataIndex: 'pname',
      key: 'pname'
    },
    {
      title: '参数值',
      dataIndex: 'pvalue',
      key: 'pvalue'
    },
    {
      title: '是否系统内置',
      dataIndex: 'isSys',
      width: 120,
      align: 'center',
      key: 'isSys',
      render: (txt, row) => {
        // let item = dicType(txt);
        return row.isSys == 1 ? <Tag color="#2db7f5">是</Tag> : <Tag color="#f50">否</Tag>;
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      key: 'remark'
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      width: '20%',
      key: 'option',
      render: (txt, row) => {
        return (
          <div>
            <Button
              size="small"
              style={{margin: '0 10px', background: '#87d068', color: '#fff'}}
              onClick={(e) => {
                e.stopPropagation();
                return editCallback && editCallback(row);
              }}>
              编辑
            </Button>
            {row.type != 'root' ? (
              <Button
                type="danger"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  return deleteCallback && deleteCallback(row);
                }}>
                删除
              </Button>
            ) : null}
          </div>
        );
      }
    }
  ];
  return data;
};
