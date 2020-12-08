import React, { Component } from 'react';
import { Table, Button, Tag, Badge } from 'antd';
import { Link } from 'react-router-dom';
const localSVG = require('images/banglocation.svg');
require('style/view/common/conductTable.less');
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    render: (id) => {
      return (
        <Badge
          count={id}
          style={{ minWidth: '50px', fontSize: '12px', height: '16px', lineHeight: '16px', backgroundColor: '#99a9bf' }}
        />
      );
    },
  },
  {
    title: '任务分类',
    dataIndex: 'taskCategory',
    key: 'taskCategory',
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: '任务时长',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: '出勤状态',
    dataIndex: 'attendanceStateList',
    key: 'attendanceStateList',
    render: (data) => {
      let statusDom = [];
      data.forEach((item, index) => {
        item.state == 1
          ? Array.prototype.push.call(statusDom, <Badge className="special-dot" key={index} status="success" />)
          : Array.prototype.push.call(statusDom, <Badge className="special-dot" key={index} status="error" />);
      });
      return statusDom;
    },
  },
  {
    title: '巡逻队(队员)',
    dataIndex: 'teamName',
    key: 'teamName',
  },
  {
    title: '坐标区域',
    dataIndex: 'patrolsPlace',
    key: 'patrolsPlace',
    render: (text) => {
      return (
        <span>
          <img src={localSVG} alt="local_pic" />
          {text}
        </span>
      );
    },
  },
  {
    title: '任务状态',
    dataIndex: 'taskState',
    key: 'taskState',
    render: (text) => {
      return text == 1 ? <Tag color="#2db7f5">已完成</Tag> : <Tag color="#87d068">执勤中</Tag>;
    },
  },
  {
    title: '查看',
    dataIndex: 'key',
    key: 'key',
    render: (data) => {
      return <Link to="/roster">查看巡逻轨迹</Link>;
    },
  },
];

class GridTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 5,
      currPage: 1,
      data: [],
      loading: false,
      filter: null,
    };
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    let filter = nextProps.filter;
    let _this = this;
    this.setState({ filter }, function () {
      _this.fetch({
        pageSize: _this.state.pageSize,
        currPage: 1,
        ...filter,
      });
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    let { filter } = this.state;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...filter,
    });
  };
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    this.setState({ loading: true });
    React.$ajax
      .postData('/api/dailyPatrols/listDailyPatrols', { ...params, ...this.state.filter })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = parseInt(res.pageSize) * parseInt(res.totalPage);
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({ data: res.list, loading: false, pagination });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
        <Table
          rowKey={(row) => {
            console.log(33333333);
            console.log(row);
            return 'key';
          }}
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          bordered
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
export default GridTable;
