import React, { Component } from 'react';
import { Form, Table, Button, Icon, Popconfirm, message, Modal, Row, Col, Input, Spin, Card, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import moment from 'moment';
import { firstLayout } from 'util/Layout';
const { Meta } = Card;
class DogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      visible: false,
      pageSize: 10,
      currPage: 1,
      totalPage: 1,
      selectedRowKeys: [],
    };
  }
  componentWillMount() {
    this.fetch();
  }
  fetch = (params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) => {
    this.setState({ loading: true });
    React.$ajax.postData('/api/outdoorTask/listPlanData', params).then((res) => {
      this.setState({
        dataSource: [...this.state.dataSource, ...res.data.list],
        loading: false,
        totalPage: res.data.totalPage,
      });
    });
  };
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.filter);
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    let filter = nextProps.filter;
    let _this = this;
    this.setState({ filter: filter, pageSize: 10, currPage: 1, dataSource: [] }, function () {
      this.fetch({ pageSize: 10, currPage: 1, ...filter });
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
    });
  };
  loadMore = () => {
    const { pageSize, currPage, filter } = this.state;
    this.setState(
      {
        currPage: currPage + 1,
      },
      this.fetch({ currPage: currPage + 1, pageSize, ...filter })
    );
  };
  deleteOne = (id) => {
    React.$ajax.postData('/api/outdoorTask/deletePlanByIds', { ids: [id] }).then((res) => {
      if (res.code == 0) {
        message.success('删除成功！');
        this.setState({ dataSource: [], currPage: 1 }, this.fetch({ currPage: 1, pageSize: 10 }));
      }
    });
  };
  render() {
    const { dataSource, loading, pagination, selectedRowKeys } = this.state;

    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <Link to={{ pathname: '/app/monitoring/itinerancyAdd', query: { targetText: '新增' } }}>
            <Button type="primary">新增任务</Button>
          </Link>
        </div>
        <div>
          {dataSource.map((item) => (
            <Card
              key={item.id}
              style={{ display: 'inline-block', width: 300, margin: '0 10px 10px 0' }}
              actions={[
                // <Link to={{pathname:'/app/monitoring/itinerancyEdit', query: {editItem: item}}}>
                // <span><Icon type="edit" style={{marginRight: 7}} />修改</span></Link>,
                <span>
                  <Popconfirm title="确认删除此外勤任务信息?" onConfirm={() => this.deleteOne(item.id)}>
                    <Icon type="delete" style={{ marginRight: 7 }} />
                    删除
                  </Popconfirm>
                </span>,
              ]}
            >
              <Meta
                // avatar={}
                title={`任务名称: ${item.name}`}
                description={[
                  <div
                    key={item.id + '01'}
                    style={{
                      wordBreak: 'keep-all',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <Tooltip autoAdjustOverflow="false" placement="topLeft" title={item.userNames.join(',')}>
                      {' '}
                      人员：{item.userNames.join(',')}
                    </Tooltip>
                  </div>,
                  <div key={item.id + '02'} className="item">
                    <span>上报人员：</span>
                    <span>{item.reportUserName ? item.reportUserName : '----'}</span>
                  </div>,
                  <Tooltip key={item.id + '03'} autoAdjustOverflow="false" placement="topLeft" title={item.content}>
                    <div
                      style={{
                        wordBreak: 'keep-all',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      勤务说明：
                      <p style={{ marginBottom: 0 }}>{item.content}</p>
                    </div>
                  </Tooltip>,
                  <div key={item.id + '04'} className="item">
                    <span>发布时间：</span>
                    <span>{item.publishDate ? moment(item.publishDate).format('YYYY-MM-DD HH:mm') : '----'}</span>
                  </div>,
                  <div key={item.id + '05'} className="item">
                    <span>发布人员：</span>
                    <span>{item.operator ? item.operator : '--'}</span>
                  </div>,
                ]}
              />
            </Card>
          ))}
          {this.state.totalPage <= this.state.currPage ? (
            ''
          ) : (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
              {this.state.loading && <Spin />} <Button onClick={this.loadMore}>加载更多</Button>{' '}
            </div>
          )}
          {this.state.dataSource.length == 0 ? (
            <div style={{ textAlign: 'center', color: '#999', marginTop: 12, height: 32, lineHeight: '32px' }}>
              {' '}
              暂无数据
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
export default Form.create()(DogTable);
