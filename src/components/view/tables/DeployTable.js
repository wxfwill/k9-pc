import React, {Component} from 'react';
import {Table, Button, Tag, Badge, Icon, Avatar, List, Row, Col, Card, message, Popconfirm} from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
import Immutable from 'immutable';

import Moment from 'moment';
const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');
class DeployTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      pageSize: 8,
      currPage: 1,
      data: [],
      loading: false,
      // 通过“加载更多”加载数据
      listByLoad: {
        loadingMore: false,
        showLoadingMore: false,
        data: []
      }
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
    this.fetch({
      currPage: 1,
      pageSize: this.state.pageSize,
      ...filter
    });
    this.state.listByLoad = {
      loadingMore: false,
      showLoadingMore: false,
      data: []
    };
    this.state.currPage = 1;
  }
  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});

    React.$ajax
      .postData('/api/cmdMonitor/listEmergencyDeploymentPlan', {...params})
      .then((res) => {
        if (res && !res.data) {
          this.setState({loading: false});
          return;
        }
        const pagination = {...this.state.pagination};
        pagination.total = res.data.totalCount;
        pagination.current = res.data.currPage;
        pagination.pageSize = res.data.pageSize;
        const _total = res.data.totalCount;
        const _currPage = res.data.currPage;
        const _temp = pagination.current + 1;
        const _size = this.state.pageSize;
        const _show = !(_currPage == parseInt(_total / _size) + (_total % _size > 0 ? 1 : 0) || !_total);
        const _listByLoad = {
          loadingMore: false,
          showLoadingMore: _show,
          data: this.state.listByLoad.data.concat(res.data.list)
        };

        this.setState({
          data: res.data.list,
          loading: false,
          pagination,
          currPage: _temp,
          listByLoad: _listByLoad
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // 加载更多
  onLoadMore = () => {
    this.setState({loading: true});
    const pager = {...this.state.pagination};
    var nextpage = (pager.current = this.state.currPage);
    const {filter} = this.props;
    this.setState({
      pagination: pager,
      currPage: nextpage++
    });
    this.fetch({
      currPage: this.state.currPage,
      pageSize: this.state.pageSize,
      ...filter
    });
  };
  deleteTask = (id, index) => {
    httpAjax('post', config.apiUrl + '/api/cmdMonitor/delEmergencyDeploymentPlanById', {id: id}).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        this.setState(
          {
            currPage: 1,
            listByLoad: {
              data: []
            }
          },
          this.fetch({
            pageSize: this.state.pageSize,
            currPage: 1
          })
        );
      } else {
        message.serror('删除失败');
      }
    });
  };

  render() {
    const {match} = this.props;
    const {loadingMore, showLoadingMore} = this.state.listByLoad;
    const loadMore = showLoadingMore ? (
      <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
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
            <Link to="/app/monitoring/deployAdd">
              <Icon type="plus-circle-o" /> 新建任务
            </Link>
          </Button>
        </div>
        <List
          grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4}}
          loading={this.state.loading}
          dataSource={this.state.listByLoad.data}
          loadMore={loadMore}
          renderItem={(item, index) => (
            <List.Item>
              <Card
                className="deployCards"
                hoverable
                actions={
                  item.saveStatus === 0
                    ? [
                        <Link to={{pathname: '/app/monitoring/deployAdd', query: {id: item.id}}}>
                          {' '}
                          <Icon type="edit" /> 编辑草稿
                        </Link>,
                        <Popconfirm title="确认删除此任务信息?" onConfirm={() => this.deleteTask(item.id)}>
                          <Icon type="delete" /> 删除
                        </Popconfirm>
                      ]
                    : [
                        <Link to={{pathname: '/app/monitoring/RoundsTrack/' + item.id, query: {type: 'deploy'}}}>
                          <Icon type="eye" /> 查看轨迹
                        </Link>
                      ]
                }
                //     actions={[<span>{item.saveStatus === 0 ? <Link to={{ pathname: "/app/monitoring/deployAdd", query: { id: item.id } }} > <Icon type="edit" /> 编辑</Link> : <Link to={{ pathname: "/app/monitoring/RoundsTrack/" + item.id }} ><Icon type="eye" /> 查看轨迹</Link>} </span>]}
              >
                <Row>
                  <Col md={4}>
                    {' '}
                    <Avatar shape="square" size="large" icon="setting" />
                  </Col>
                  <Col md={20}>
                    <div className="cardsList-div">
                      <table style={{fontSize: 12, color: '#666'}}>
                        <tbody>
                          <tr>
                            <td style={{fontSize: 14, fontWeight: 800, paddingBottom: '8px'}}>
                              <span
                                style={{
                                  width: 155,
                                  height: 17,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                {item.taskName}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>时间：{item.startDateStr ? moment(item.startDateStr).format('YYYY-MM-DD') : '--'}</td>
                          </tr>
                          <tr>
                            <td>
                              人员：
                              <span
                                style={{
                                  width: 155,
                                  height: 17,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                {item.userNames || '- '}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              上报人员：
                              <span
                                style={{
                                  width: 155,
                                  height: 17,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                {item.reportUserName || '- '}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              任务状态：
                              {item.saveStatus === 0 ? (
                                <Badge status="warning" text="未发布" />
                              ) : (
                                <Badge status="processing" text="已发布" />
                              )}{' '}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              区域参数：
                              <span
                                style={{
                                  width: 155,
                                  height: 17,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                {item.location ? item.location : '-'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              发布时间：
                              {item.publishDate ? moment(item.publishDate).format('YYYY-MM-DD HH:mm:ss') : '--'}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              发布人员：
                              <span
                                style={{
                                  width: 155,
                                  height: 17,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                {item.operator || '--'}
                              </span>
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
export default DeployTable;

// WEBPACK FOOTER //
// ./src/components/view/tables/DeployTable.js
