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
export const menuOperate = (editCallback, deleteCallback) => {
  let data = [
    {
      title: '导航标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '导航地址',
      dataIndex: 'openAddr',
      key: 'openAddr',
    },
    {
      title: '导航参数',
      dataIndex: 'openParam',
      // align: 'left',
      key: 'openParam',
    },
    {
      title: '导航打开方式',
      dataIndex: 'openType',
      // align: 'left',
      key: 'openType',
    },
    {
      title: '默认图标',
      dataIndex: 'normalIconUrl',
      align: 'center',
      width: '20%',
      key: 'normalIconUrl',
      render: (txt, row) => {
        return row.normalIconUrl ? (
          <img src={row.normalIconUrl} alt="icon" style={{ width: '30px', height: '30px' }} />
        ) : (
          '暂无图标'
        );
      },
    },
    {
      title: '高亮图标',
      dataIndex: 'highlightIconUrl',
      align: 'center',
      width: '20%',
      key: 'highlightIconUrl',
      render: (txt, row) => {
        return row.highlightIconUrl ? (
          <img src={row.highlightIconUrl} alt="icon" style={{ width: '30px', height: '30px' }} />
        ) : (
          '暂无图标'
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sn',
      align: 'center',
      key: 'sn',
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      align: 'center',
      key: 'enabled',
      render: (txt, row) => {
        // let item = dicType(txt);
        return row.enabled == 1 ? <Tag color="#2db7f5">是</Tag> : <Tag color="#f50">否</Tag>;
      },
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
