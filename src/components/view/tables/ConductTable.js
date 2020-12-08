import React, { Component } from 'react';
import { Table, Button, Tag, Badge, List, Card, Icon, Avatar, Col, Row, Tooltip, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
import Immutable from 'immutable';

const localSVG = require('images/banglocation.svg');
require('style/view/common/conductTable.less');
class ConductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 8,
      currPage: 1,
      data: [],
      loading: false,
      filter: null,
      firstLoad: true,
      taskStatus: '',
      // 通过“加载更多”加载数据
      listByLoad: {
        loadingMore: false,
        showLoadingMore: false,
        data: [],
      },
    };
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    let isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      let filter = nextProps.filter;
      let _this = this;
      // 点击查询不支持过滤巡逻状态
      this.setState({ firstLoad: true, taskStatus: '' });
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
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage, isFinish: this.state.taskStatus }) {
    this.setState({ loading: true });
    React.$ajax
      .postData('/api/dailyPatrols/listDailyPatrols', { ...params, ...this.state.filter })
      .then((obj) => {
        const pagination = { ...this.state.pagination };
        let res = obj.data;
        pagination.total = parseInt(res.pageSize) * parseInt(res.totalPage);
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;

        let _total = res.totalCount,
          _currPage = res.currPage,
          _temp = pagination.current + 1,
          _size = this.state.pageSize,
          _show = _currPage == parseInt(_total / _size) + (_total % _size > 0 ? 1 : 0) || !_total ? false : true,
          _listByLoad = {
            loadingMore: false,
            showLoadingMore: _show,
            data: this.state.firstLoad ? res.list : this.state.listByLoad.data.concat(res.list),
          };

        this.setState({
          data: res.list,
          loading: false,
          firstLoad: false,
          pagination,
          currPage: _temp,
          listByLoad: _listByLoad,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // 加载更多
  onLoadMore = () => {
    this.fetch();
  };
  // 正在巡逻和巡逻完成
  switchTaskStatus = (st) => {
    this.setState({ firstLoad: true, taskStatus: st });
    this.fetch({
      pageSize: this.state.pageSize,
      currPage: 1,
      isFinish: st,
    });
  };
  footer(currentPageData) {
    return (
      <div>
        <Badge className="special-dot footer-dot" status="error" />
        <span>设备不在指定区域内</span>
        <Badge className="special-dot footer-dot" status="success" />
        <span>设备在指定区域内</span>
        <Badge className="special-dot footer-dot" status="default" />
        <span>任务结束</span>
      </div>
    );
  }

  deleteTask = (id, index) => {
    httpAjax('post', config.apiUrl + '/api/dailyPatrols/delTaskById', { id: id }).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        this.setState(
          {
            currPage: 1,
            listByLoad: {
              data: [],
            },
          },
          this.fetch({
            pageSize: this.state.pageSize,
            currPage: 1,
          })
        );
      } else {
        message.serror('删除失败');
      }
    });
  };

  render() {
    const { loadingMore, showLoadingMore } = this.state.listByLoad;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && (
          <Button loading={this.state.loading} onClick={this.onLoadMore}>
            加载更多
          </Button>
        )}
      </div>
    ) : null;
    return (
      <div>
        <div className="table-operations">
          <Button type="primary">
            <Link to="/app/monitoring/dutyAdd">
              <Icon type="plus-circle-o" /> 新建任务
            </Link>
          </Button>
          <Button
            type="primary"
            onClick={() => {
              this.switchTaskStatus('1');
            }}
          >
            <i className="iconfont icon-zhuazhualiugou"></i> 正在巡逻
          </Button>
          <Button
            type="primary"
            onClick={() => {
              this.switchTaskStatus('2');
            }}
          >
            {' '}
            <Icon type="check-circle-o" /> 巡逻完成
          </Button>
        </div>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4 }}
          loading={this.state.loading}
          dataSource={this.state.listByLoad.data}
          loadMore={loadMore}
          renderItem={(item, index) => (
            <List.Item>
              <Card
                className="deployCards"
                hoverable={true}
                actions={
                  item.saveStatus === 0
                    ? [
                        <Link to={{ pathname: '/app/monitoring/dutyEdit', query: { id: item.id } }}>
                          {' '}
                          <Icon type="edit" /> 编辑草稿
                        </Link>,
                        <Popconfirm title="确认删除此任务信息?" onConfirm={() => this.deleteTask(item.id)}>
                          <Icon type="delete" /> 删除
                        </Popconfirm>,
                      ]
                    : [
                        <Link to={{ pathname: '/app/monitoring/RoundsTrack/' + item.id, query: { type: 'duty' } }}>
                          <Icon type="eye" /> 查看轨迹
                        </Link>,
                      ]
                }
              >
                <Row>
                  <Col md={4} sm={24} xs={24}>
                    {' '}
                    <Avatar shape="square" size="large" icon="setting" />
                  </Col>
                  <Col md={20}>
                    <div className="cardsList-div">
                      <table style={{ fontSize: 12, color: '#666' }}>
                        <tbody>
                          <tr>
                            <td style={{ fontSize: 14, fontWeight: 800, paddingBottom: '8px' }}>
                              <span
                                style={{
                                  width: 155,
                                  height: 17,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.taskName}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>开始时间：{item.startTime || '-'} </td>
                          </tr>
                          <tr>
                            <td>结束时间：{item.endTime || '-'}</td>
                          </tr>
                          <tr>
                            <td>
                              <Tooltip placement="topLeft" title={item.userNameList.join(',')}>
                                <span className="duty-table-membs">
                                  巡逻人员：{item.userNameList.join('，') || '- '}
                                </span>
                              </Tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>发布状态：{item.saveStatus == 1 ? '已发布' : '未发布' || '-'}</td>
                          </tr>
                          <tr>
                            <td>发布人员：{item.operator || '-'}</td>
                          </tr>
                          <tr>
                            <td>
                              发布时间：
                              {item.saveStatus == 1 && item.publishDate
                                ? moment(item.publishDate).format('YYYY-MM-DD HH:mm:ss')
                                : '--'}
                            </td>
                          </tr>
                          {/* <tr><td>巡逻状态：{item.taskStatus === 0 || item.taskStatus == "" ? <Badge status="warning" text="未开始" /> : (item.taskStatus === 1 ? <Badge status="processing" text="正在巡逻" /> : <Badge status="success" text="巡逻完成" />)} </td></tr>*/}
                          <tr>
                            <td>
                              区域参数：
                              {
                                <Tooltip placement="bottom" title={item.patrolsLocation || '-'}>
                                  {' '}
                                  <Icon style={{ color: '#1890ff' }} type="environment-o" />
                                </Tooltip>
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default ConductTable;

// WEBPACK FOOTER //
// ./src/components/view/tables/ConductTable.js
