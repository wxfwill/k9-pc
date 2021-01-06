import React, {Component} from 'react';
import {Table, Icon, Divider, Tag} from 'antd';

const columns = [
  {
    title: 'ID',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '坐标',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '状态',
    dataIndex: 'address',
    key: 'address',
    render: (text) => <Tag color="#87d068">{text}</Tag>
  },
  {
    title: '时长',
    dataIndex: 'action',
    key: 'action'
  }
];

const data = [
  {
    key: '1',
    name: '1423',
    age: '12,131',
    address: '执勤中',
    action: '12'
  },
  {
    key: '2',
    name: '2314',
    age: '11,131',
    address: '执勤中',
    action: '12'
  },
  {
    key: '3',
    name: '2245',
    age: '13,116',
    address: '执勤中',
    action: '12'
  }
];
class ExeCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Table rowKey="id" columns={columns} dataSource={data} pagination={false} loading={false} scroll={{x: 306}} />
    );
  }
}

export default ExeCard;
