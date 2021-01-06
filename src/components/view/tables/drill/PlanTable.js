import React, {Component} from 'react';
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
  Tooltip
} from 'antd';
import {Link} from 'react-router-dom';
import moment from 'moment';
import Immutable from 'immutable';
import SubDetailTabe from './SubDetailTabe';
// require('style/view/common/deployTable.less');
import 'style/app/dogManage/dogCure/dogCureTable.less';
const localSVG = require('images/banglocation.svg');

class SubTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      pageSize: 10,
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
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    const filter = nextProps.filter;
    const isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      const _this = this;
      this.setState({filter, data: []}, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter,
          trainDate: filter.trainDate && filter.trainDate.format('x')
        });
      });
    }
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    const {filter} = this.state;
    this.setState({
      pagination: pager
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...filter
    });
  };
  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});
    React.$ajax
      .postData('/api/train/listPlanPage', {...params})
      .then((obj) => {
        const res = obj.data;
        const pagination = {...this.state.pagination};
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({
          data: [...this.state.data, ...res.list],
          loading: false,
          pagination,
          totalPage: res.totalPage
        });
      })
      .catch(function (error) {
        console.log(error);
      });
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
  queryDetail = (data) => {
    this.setState({
      detailTitle: data,
      showDetail: true,
      changeLeft: true
    });
  };
  loadMore = () => {
    const {currPage, pageSize, filter} = this.state;
    this.setState(
      {currPage: currPage + 1},
      this.fetch({
        currPage: currPage + 1,
        pageSize,
        ...filter
      })
    );
  };
  deletePlan = (item) => {
    React.$ajax.postData('/api/train/deleteByIds', {ids: [item.id]}).then((res) => {
      if (res.code == 0) {
        message.info('删除成功！');
        this.setState(
          {
            currPage: 1,
            data: []
          },
          this.fetch({currPage: 1, pageSize: this.state.pageSize})
        );
      } else {
        message.error('删除失败！');
      }
    });
  };
  renderCardItem = (item) => {
    const pathname = this.props.pathname.indexOf('app') >= 0 ? 'app' : 'view';

    const ItemTitle = (
      <div className="card_title">
        <div
          className="title_h"
          style={{width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          <Tooltip title={item.subjectName}>训练科目： {item.subjectName}</Tooltip>
        </div>
        <div className="item">
          <span>训犬人员：</span>
          <Tooltip title={item.userNames}>
            <span>{item.userNames}</span>
          </Tooltip>
        </div>
        <div className="item">
          <span>训练时间：</span>
          <span>{moment(item.trainDate).format('YYYY-MM-DD')}</span>
        </div>
        <div
          className="item"
          style={{width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          <Tooltip title={item.location ? item.location : '--'}>
            训练场地： {item.location ? item.location : '--'}
          </Tooltip>
        </div>
        <div className="item">
          <span>训练说明：</span>
          <span>{item.remark}</span>
        </div>
        <div className="item">
          <span>发布时间：</span>
          <span>
            {item.saveStatus == 1 && item.publishDate ? moment(item.publishDate).format('YYYY-MM-DD HH:mm:ss') : '----'}
          </span>
        </div>
        <div className="item">
          <span>发布人员：</span>
          <span>{item.operator ? item.operator : '--'}</span>
        </div>
      </div>
    );

    return (
      <Card
        title={ItemTitle}
        key={item.id + 'card'}
        extra={item.saveStatus == 0 ? <Tag color="#f50">未发布</Tag> : <Tag color="#108ee9">已发布</Tag>}
        style={{minWidth: 380, width: '23%', maxWidth: 480, display: 'inline-block', margin: '0 20px 20px 0'}}
        bodyStyle={{padding: '15px 32px'}}>
        <div className="item_body">
          {item.saveStatus == 0 ? (
            <div className="body_detail">
              <Link to={{pathname: '/app/drill/planEdit', query: {editItem: item}}}>
                <Icon type="edit" style={{cursor: 'pointer', margin: '0 10px 0 -10px', color: '#999999'}} />
                <span style={{color: '#999'}}>编辑</span>
              </Link>{' '}
            </div>
          ) : null}

          {item.saveStatus == 0 ? null : (
            <div className="body_detail" style={{borderRight: '0'}}>
              <Link to={{pathname: '/app/drill/planDetail', query: {editItem: item}}}>
                <Icon type="eye" style={{cursor: 'pointer', margin: '0 10px 0 -10px', color: '#999999'}} />
                <span style={{color: '#999'}}> 查看</span>{' '}
              </Link>{' '}
            </div>
          )}

          {item.saveStatus == 0 ? (
            <div className="body_delete">
              {' '}
              <Popconfirm title="确认删除此计划信息?" onConfirm={() => this.deletePlan(item)}>
                <span style={{cursor: 'pointer'}}>
                  <Icon type="delete" style={{margin: '0 10px'}} />
                  删除
                </span>
              </Popconfirm>
            </div>
          ) : null}
        </div>
      </Card>
    );
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
        title: '训练项目',
        dataIndex: 'trainSubjectName',
        key: 'trainSubjectName'
      },
      {
        title: '训练阶段',
        dataIndex: 'trainLevel',
        key: 'trainLevel',
        render: (level) => {
          const levelNum = parseInt(level) - 1;
          const levelArr = ['初级', '中级', '高级'];
          return levelArr[levelNum];
        }
      },
      {
        title: '操作',
        dataIndex: 'key',
        key: 'key',
        render: (data) => {
          return (
            <span style={{color: '#1890ff', cursor: 'pointer'}} onClick={() => this.queryDetail(data)}>
              查看详情
            </span>
          );
        }
      }
    ];
    return (
      <div className="dogCureTable" style={{paddingTop: '0'}}>
        <div style={{marginBottom: '20px'}}>
          <Button type="primary" style={{marginRight: '20px'}}>
            <Link to={{pathname: `/app/drill/planAdd`, query: {targetText: '新增'}}}>新增训练计划</Link>
          </Button>
        </div>

        {this.state.data.map((item) => {
          return this.renderCardItem(item);
        })}
        {this.state.totalPage <= this.state.currPage ? (
          ''
        ) : (
          <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
            {this.state.loading && <Spin />} <Button onClick={this.loadMore}>加载更多</Button>{' '}
          </div>
        )}
        {this.state.data.length == 0 ? (
          <div style={{textAlign: 'center', color: '#999', marginTop: 12, height: 32, lineHeight: '32px'}}>
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
// ./src/components/view/tables/drill/PlanTable.js
