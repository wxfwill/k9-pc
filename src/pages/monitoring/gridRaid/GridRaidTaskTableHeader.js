import React from 'react';
import {Button, Tag} from 'antd';
import moment from 'moment';

export const tableHeader = (callbackView) => {
  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (id) => {
    //     return (
    //       <Badge
    //         count={id}
    //         style={{
    //           minWidth: '50px',
    //           fontSize: '12px',
    //           height: '16px',
    //           lineHeight: '16px',
    //           backgroundColor: '#99a9bf'
    //         }}
    //       />
    //     );
    //   }
    // },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName'
    },
    {
      title: '执行日期',
      dataIndex: 'taskDate',
      key: 'taskDate',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : '--';
      }
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      }
    },
    ,
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      render: (text) => {
        return text == 0 ? (
          <Tag style={{width: '80px', padding: '2px 0'}} color="#87d068">
            未开始
          </Tag>
        ) : text == 3 ? (
          <Tag style={{width: '80px', padding: '2px 0'}} color="#108ee9">
            结束
          </Tag>
        ) : (
          <Tag style={{width: '80px', padding: '2px 0'}} color="#f50">
            进行中
          </Tag>
        );
      }
    },
    {
      title: '发布人员',
      dataIndex: 'publishUserName',
      key: 'publishUserName',
      render: (text) => {
        return text || '--';
      }
    },
    {
      title: '操作',
      dataIndex: 'key',
      key: 'key',
      render: (id, record) => {
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
              }}>
              查看
            </Button>
          </span>
        );
      }
    }
  ];
  return columns;
};
