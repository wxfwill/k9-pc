import React, { Component } from 'react';
import { Table, Icon, Divider, Tag } from 'antd';
import httpAjax from 'libs/httpAjax';
require('style/view/home/exeCard.less');
const columns = [
  {
    title: 'ID',
    dataIndex: 'name',
    className: 'id-number',
    key: 'name',
  },
  {
    title: '坐标',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '时长',
    dataIndex: 'action',
    key: 'action',
  },
];

const data = [
  {
    key: '1',
    name: '1423',
    age: '12,131',
    action: '02:21:20',
  },
  {
    key: '2',
    name: '2314',
    age: '11,131',
    action: '02:21:20',
  },
  {
    key: '3',
    name: '2245',
    age: '13,116',
    action: '02:21:20',
  },
];
class ExeCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="table-c">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={false}
          scroll={{ x: 306 }}
          className="status-table"
        />
      </div>
    );
  }
}

export default ExeCard;
