import React, { Component } from 'react';
import {
  Table,
  Button,
  Icon,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Avatar,
  Checkbox,
  List,
  Spin,
  Divider,
  Badge,
  Tag,
  Tooltip,
} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Immutable from 'immutable';

import SubDetailTabe from './SubDetailTabe';
const localSVG = require('images/banglocation.svg');
// require('style/view/common/deployTable.less');
import 'style/app/dogManage/dogCure/dogCureTable.less';

class SubTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 10,
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
      this.setState({ filter, data: [] }, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter,
          trainDate: filter.trainDate && filter.trainDate.format('x'),
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
    React.$ajax
      .postData('/api/train/listTeamUserPage', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({
          data: [...this.state.data, ...res.list],
          loading: false,
          pagination,
          totalPage: res.totalPage,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
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
  queryDetail = (data) => {
    this.setState({
      detailTitle: data,
      showDetail: true,
      changeLeft: true,
    });
  };
  loadMore = () => {
    const { currPage, pageSize, filter } = this.state;
    this.setState(
      { currPage: currPage + 1 },
      this.fetch({
        currPage: currPage + 1,
        pageSize,
        ...filter,
      })
    );
  };
  deletePlan = (item) => {
    React.$ajax.postData('/api/train/deleteTeamByIds', { ids: [item.id] }).then((res) => {
      if (res.code == 0) {
        message.info('删除成功！');
        this.setState(
          {
            currPage: 1,
            data: [],
          },
          this.fetch({ currPage: 1, pageSize: this.state.pageSize })
        );
      } else {
        message.error('删除失败！');
      }
    });
  };
  mapPeoples = (arr, type) => {
    const peos = arr.map((t) => t.userName);
    const ids = arr.map((t) => t.id);
    return type == 'id' ? ids : peos.join(',');
  };
  renderCardItem = (item) => {
    const pathname = this.props.pathname.indexOf('app') >= 0 ? 'app' : 'view';

    const ItemTitle = (
      <div className="card_title">
        <div
          className="title_h"
          style={{ width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          <Tooltip placement="topLeft" title={item.subjectName}>
            队名： {item.name}
          </Tooltip>
        </div>
        <div className="item">
          <span>队长：</span>
          <span>{item.leader.userName}</span>
        </div>
        <div
          className="item"
          style={{ width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          <Tooltip placement="topLeft" title={item.members && this.mapPeoples(item.members)}>
            <span>队员：</span>
            <span>{item.members && this.mapPeoples(item.members)}</span>
          </Tooltip>
        </div>
        {/* <div className="item">
            <span>训练场地：</span><span>{item.placeName}</span>
        </div>
        <div className="item">
            <span>训练说明：</span><span>{item.remark}</span>
        </div> */}
      </div>
    );

    return (
      <Card
        title={ItemTitle}
        key={item.id + 'card'}
        // extra={item.saveStatus ==0?<Tag color="#f50">未发布</Tag>:<Tag color="#108ee9">已发布</Tag>}
        style={{ minWidth: 380, width: '23%', maxWidth: 480, display: 'inline-block', margin: '0 20px 20px 0' }}
        bodyStyle={{ padding: '15px 32px' }}
      >
        <div className="item_body">
          <div className="body_detail">
            <Link to={{ pathname: '/app/drill/teamEdit', query: { editItem: item } }}>
              <Icon type="edit" style={{ cursor: 'pointer', margin: '0 10px 0 -10px', color: '#999999' }} />
              <span style={{ color: '#999' }}>编辑</span>
            </Link>
          </div>
          <div className="body_delete">
            <Popconfirm title="确认删除此计划信息?" onConfirm={() => this.deletePlan(item)}>
              <span style={{ cursor: 'pointer' }}>
                <Icon type="delete" style={{ margin: '0 10px' }} />
                删除
              </span>
            </Popconfirm>
          </div>
        </div>
      </Card>
    );
  };

  render() {
    return (
      <div className="dogCureTable" style={{ paddingTop: '0' }}>
        <div style={{ marginBottom: '20px' }}>
          <Button type="primary" style={{ marginRight: '20px' }}>
            <Link to={{ pathname: `/app/drill/teamAdd`, query: { targetText: '新增' } }}>新增分组</Link>
          </Button>
        </div>

        {this.state.data.map((item) => {
          return this.renderCardItem(item);
        })}
        {this.state.totalPage <= this.state.currPage ? (
          ''
        ) : (
          <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
            {this.state.loading && <Spin />} <Button onClick={this.loadMore}>加载更多</Button>{' '}
          </div>
        )}
        {this.state.data.length == 0 ? (
          <div style={{ textAlign: 'center', color: '#999', marginTop: 12, height: 32, lineHeight: '32px' }}>
            {' '}
            暂无数据
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
export default SubTable;

// WEBPACK FOOTER //
// ./src/components/view/tables/drill/TeamTable.js
