import React, { Component } from 'react';
import { Table, Button, Tag, Badge, Icon } from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';

import PrevDetailTable from './PrevDetailTabl';
const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');
class PrevTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 3,
      currPage: 1,
      data: [],
      loading: false,
      filter: null,
      changeLeft: false,
      showDetail: false,
    };
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    let filter = nextProps.filter;
    let isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      let _this = this;
      this.setState({ filter }, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter,
        });
      });
    }
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
    httpAjax('post', config.apiUrl + '/api/vaccineRecord/list', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({ data: res.list, loading: false, pagination });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  queryDetail = (data) => {
    this.setState({
      detailTitle: data,
      showDetail: true,
      changeLeft: true,
    });
  };
  handleShow() {
    let _this = this;
    this.setState(
      {
        changeLeft: false,
      },
      function () {
        setTimeout(() => {
          _this.setState({
            showDetail: false,
          });
        }, 600);
      }
    );
  }
  render() {
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
        title: '疫苗接种时间',
        dataIndex: 'vaccineTime',
        key: 'vaccineTime',
        render: (time) => {
          let date = new Date(time);
          let YMD = date.toLocaleString().split(' ')[0];
          let HMS = date.toString().split(' ')[4];
          let vaccineTime = YMD + ' ' + HMS;
          return vaccineTime;
        },
      },
      {
        title: '犬名',
        dataIndex: 'dogName',
        key: 'dogName',
      },
      {
        title: '疫苗名称',
        dataIndex: 'vaccineName',
        key: 'vaccineName',
      },
      {
        title: '兽医',
        dataIndex: 'veterinaryName',
        key: 'veterinaryName',
      },
      {
        title: '疫苗提醒时间',
        dataIndex: 'nextVaccineRemindingTime',
        key: 'nextVaccineRemindingTime',
        render: (time) => {
          let date = new Date(time);
          let YMD = date.toLocaleString().split(' ')[0];
          let HMS = date.toString().split(' ')[4];
          let nextVaccineRemindingTime = YMD + ' ' + HMS;
          return nextVaccineRemindingTime;
        },
      },
      {
        title: '操作',
        dataIndex: 'dogId',
        key: 'dogId',
        render: (data) => {
          return (
            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.queryDetail(data)}>
              查看详情
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <div className="table-operations"></div>
        <Table
          rowKey="id"
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          bordered
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
        {this.state.showDetail ? (
          <PrevDetailTable
            handleShow={this.handleShow.bind(this)}
            caption={this.state.detailTitle}
            changeLeft={this.state.changeLeft}
          />
        ) : null}
      </div>
    );
  }
}
export default PrevTable;

// WEBPACK FOOTER //
// ./src/components/view/tables/dog/PrevTable.js
