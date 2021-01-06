import React, {Component} from 'react';
import {Table, Button, Tag, Badge, Icon} from 'antd';
import {Link} from 'react-router-dom';
import moment from 'moment';
import CureDetailTabl from './CureDetailTabl';
import Immutable from 'immutable';
const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');
class CureTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      pageSize: 3,
      currPage: 1,
      data: [],
      loading: false,
      filter: null,
      changeLeft: false,
      showDetail: false
    };
  }
  componentWillMount() {
    this.fetch();
  }
  handleShow() {
    const _this = this;
    this.setState(
      {
        changeLeft: false
      },
      function () {
        setTimeout(() => {
          _this.setState({
            showDetail: false
          });
        }, 600);
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    const filter = nextProps.filter;
    const isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      const _this = this;
      this.setState({filter}, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter
        });
      });
    }
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current
    });
  };
  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});
    React.$ajax
      .postData('/api/treatmentRecord/list', {...params})
      .then((res) => {
        const pagination = {...this.state.pagination};
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({data: res.list, loading: false, pagination});
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  queryDetail = (data) => {
    this.setState({
      detailTitle: data,
      showDetail: true,
      changeLeft: true
    });
  };
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
                backgroundColor: '#99a9bf'
              }}
            />
          );
        }
      },
      {
        title: '发病日期',
        dataIndex: 'morbidityTime',
        key: 'morbidityTime',
        render: (time) => {
          return moment(time).format('YYYY-MM-DD');
        }
      },
      {
        title: '犬名',
        dataIndex: 'dogName',
        key: 'dogName'
      },
      {
        title: '发病症状',
        dataIndex: 'symptom',
        key: 'symptom'
      },
      {
        title: '诊断结果',
        dataIndex: 'treatmentResults',
        key: 'treatmentResults',
        render: (result) => {
          const resArr = [<Tag color="#2db7f5">痊&nbsp;&nbsp;&nbsp;愈</Tag>, <Tag color="#f50">未痊愈</Tag>];
          return resArr[result - 1];
        }
      },
      {
        title: '兽医',
        dataIndex: 'veterinaryName',
        key: 'veterinaryName'
      },
      {
        title: '操作',
        dataIndex: 'key',
        key: 'key',
        render: (data, item, b) => {
          return (
            <span style={{color: '#1890ff', cursor: 'pointer'}} onClick={this.queryDetail.bind(this, item)}>
              查看详情
            </span>
          );
        }
      }
    ];
    return (
      <div>
        <div className="table-operations"></div>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          bordered
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
        {this.state.showDetail ? (
          <CureDetailTabl
            handleShow={this.handleShow.bind(this)}
            caption={this.state.detailTitle}
            changeLeft={this.state.changeLeft}
          />
        ) : null}
      </div>
    );
  }
}
export default CureTable;
