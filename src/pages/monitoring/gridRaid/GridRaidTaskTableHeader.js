import React, { Component } from 'react';
import { Table, Button, Tag, Badge, Icon, Divider } from 'antd';
import moment from 'moment';

export const tableHeader = (callbackView) => {
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return (
          <Badge
            count={id}
            style={{
              minWidth: '50px',
              fontSize: '12px',
              height: '16px',
              lineHeight: '16px',
              backgroundColor: '#99a9bf',
            }}
          />
        );
      },
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '执行日期',
      dataIndex: 'taskDate',
      key: 'taskDate',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : '--';
      },
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    },
    ,
    {
      title: '发布人员',
      dataIndex: 'operator',
      key: 'operator',
      render: (text) => {
        return text ? text : '--';
      },
    },
    {
      title: '操作',
      dataIndex: 'key',
      key: 'key',
      render: (id, record, index) => {
        return (
          <span>
            {/* <Link
            to={{
              pathname: '/app/monitoring/ViewGridRaidTask/' + record.id,
            }}
          >
            巡逻轨迹
          </Link>
          <Divider type="vertical" /> */}
            {/* <Link
            to={{
              pathname: '/app/monitoring/ViewGridRaidRealTime/' + record.id,
            }}
          >
            实时轨迹
          </Link> */}
            <Button
              type="primary"
              size="small"
              onClick={() => {
                return callbackView && callbackView(record);
              }}
            >
              查看
            </Button>
          </span>
        );
      },
    },
  ];
  return columns;
};
