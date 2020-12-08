import React, { Component } from 'react';
import { Table, Button, Icon, Popconfirm, message, Tag, Badge, Card, Spin } from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
import Immutable from 'immutable';

import 'style/app/dogManage/dogCure/dogCureTable.less';
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
      pageSize: 10,
      currPage: 1,
      totalPage: 1,
      selectedRowKeys: [],
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
    let _this = this;
    this.setState({ filter: filter, dataSource: [] }, function () {
      _this.fetch({
        pageSize: _this.state.pageSize,
        currPage: 1,
        ...filter,
      });
    });
  }
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    this.setState({ loading: true });
    React.$ajax
      .postData('/api/treatmentRecord/list', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.totalCount;
        pagination.current = res.data.currPage;
        pagination.pageSize = res.data.pageSize;
        this.setState({
          totalPage: res.data.totalPage,
          dataSource: [...this.state.dataSource, ...res.data.list],
          loading: false,
          pagination,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    let { filter } = this.state;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...filter,
    });
  };
  onSelectChange = (selectedRowKeys) => {
    //console.log(selectedRowKeys)
    this.setState({ selectedRowKeys });
  };
  renderVaccineType = (type) => {
    switch (type) {
      case 1:
        return '掉毛';
      case 2:
        return '蛔虫';
      case 3:
        return '发热';
      case 4:
        return '搜箱包';
      case 5:
        return '追踪';
      default:
        type;
    }
  };
  //删除犬只
  deleteDogs = (record, index) => {
    let { pagination, currPage, pageSize, filter } = this.state;
    httpAjax('post', config.apiUrl + '/api/treatmentRecord/deleteByIds', { ids: [record.id] }).then((res) => {
      if (res.code == 0) {
        message.success('删除成功');
        this.setState({ currPage: 1, dataSource: [] });
        this.fetch({
          pageSize,
          currPage: 1,
        });
      } else {
        message.serror('删除失败');
      }
    });
  };
  //批量删除
  deleteMore = () => {
    const { selectedRowKeys, pagination } = this.state;
    if (selectedRowKeys.length < 1) {
      message.warn('请选择要删除的治疗记录');
    } else {
      httpAjax('post', config.apiUrl + '/api/treatmentRecord/deleteByIds', { ids: selectedRowKeys }).then((res) => {
        if (res.code == 0) {
          message.success('删除成功');
          this.setState({ selectedRowKeys: [] });
          this.fetch({
            pageSize: pagination.pageSize,
            currPage: pagination.current,
          });
        } else {
          message.error('删除失败');
        }
      });
    }
  };
  addInfo = (type) => {
    sessionStorage.setItem('formStatus', type);
    sessionStorage.setItem('dogId', '');
  };
  //查看
  viewDetail = (record) => {
    sessionStorage.setItem('recordId', record.id);
    sessionStorage.setItem('formStatus', 'view');
  };
  editInfo = (record) => {
    // const {history}=this.props;
    // history.push({pathname:'/app/dog/cureEdit', query: { dogId: record.dogId,formStatus:'edit' }})

    sessionStorage.setItem('recordId', record.id);
    sessionStorage.setItem('formStatus', 'edit');
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
  renderCardItem = (item) => {
    const pathname = this.props.pathname.indexOf('app') >= 0 ? 'app' : 'view';

    const ItemTitle = (
      <div className="card_title">
        <div className="title_h">
          {item.dogName}病历卡 <i style={{ background: item.dealStatus ? '#108ee9' : '#f50' }}></i>
          <span>{item.dealStatus ? '已处理' : '未处理'}</span>
        </div>
        <div className="item">
          <span>品种：</span>
          <span>{item.breedName}</span>
        </div>
        <div className="item">
          <span>症状：</span>
          <span>{item.symptom}</span>
        </div>
        <div className="item">
          <span>带犬员：</span>
          <span>{item.trainerName}</span>
        </div>
        <div className="item">
          <span>发病日期：</span>
          <span>{moment(new Date(item.morbidityTime)).format('YYYY-MM-DD')}</span>
        </div>
        <img src={`${config.apiUrl}/api/dog/img?id=${item.dogId}`} />
        {/* <div className="item" style={{marginBottom: 0}}>
            <span>兽医：</span><span>{item.veterinaryName}</span>
        </div> */}
      </div>
    );

    return (
      <Card
        title={ItemTitle}
        key={item.id + 'card'}
        extra={item.treatmentResults == 2 ? <Tag color="#f50">未痊愈</Tag> : <Tag color="#108ee9">痊愈</Tag>}
        style={{ minWidth: 380, width: '23%', maxWidth: 480, display: 'inline-block', margin: '0 20px 20px 0' }}
        bodyStyle={{ padding: '15px 32px' }}
      >
        <div className="item_body">
          {item.dealStatus == 1 ? (
            <div className="body_detail" style={{ borderRight: '0' }}>
              <Link
                style={{ color: '#999999' }}
                to={{
                  pathname: `/${pathname}/dog/cureView`,
                  query: { dogId: item.id || record.dogId, targetText: '查看' },
                }}
                onClick={() => this.addInfo('view')}
              >
                <Icon type="eye" style={{ cursor: 'pointer', margin: '0 10px' }} />
                查看
              </Link>
            </div>
          ) : (
            <div>
              <div className="body_detail">
                <Link
                  to={{
                    pathname: `/${pathname}/dog/cureEdit`,
                    query: { dogId: item.id || record.dogId, targetText: '编辑' },
                  }}
                >
                  <Icon
                    type="edit"
                    style={{ cursor: 'pointer', color: '#999999' }}
                    onClick={() => this.editInfo(item)}
                  />
                  <span onClick={() => this.editInfo(item)} style={{ margin: '0 10px 0 10px', color: '#999999' }}>
                    编辑
                  </span>
                </Link>
                <Link
                  style={{ color: '#999999' }}
                  to={{
                    pathname: `/${pathname}/dog/cureView`,
                    query: { dogId: item.id || record.dogId, targetText: '查看' },
                  }}
                  onClick={() => this.addInfo('view')}
                >
                  <Icon type="eye" style={{ cursor: 'pointer', margin: '0 10px' }} />
                  查看
                </Link>
              </div>
              <div className="body_delete">
                <Popconfirm title="确认删除此犬病治疗信息?" onConfirm={() => this.deleteDogs(item)}>
                  <span style={{ cursor: 'pointer' }}>
                    {' '}
                    <Icon type="delete" style={{ margin: '0 10px' }} />
                    删除
                  </span>
                </Popconfirm>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };
  render() {
    const { dataSource, loading, pagination, selectedRowKeys } = this.state;
    const pathname = this.props.pathname.indexOf('app') >= 0 ? 'app' : 'view';
    return (
      <div className="dogCureTable">
        <div style={{ marginBottom: '20px' }}>
          <Button type="primary" style={{ marginRight: '20px' }} onClick={() => this.addInfo('add')}>
            <Link to={{ pathname: `/${pathname}/dog/cureAdd`, query: { targetText: '新增' } }}>新增治疗记录</Link>
          </Button>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>*/}
          {/*<Button onClick={this.deleteMore}>批量删除</Button>*/}
        </div>
        {this.state.totalPage > 0 ? (
          dataSource.map((item) => {
            return this.renderCardItem(item);
          })
        ) : (
          <div className="no_data">暂无数据</div>
        )}
        {this.state.totalPage <= this.state.currPage ? (
          ''
        ) : (
          <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
            {this.state.loading && <Spin />} <Button onClick={this.loadMore}>加载更多</Button>{' '}
          </div>
        )}
      </div>
    );
  }
}
export default DogTable;

// WEBPACK FOOTER //
// ./src/components/admin/tables/DogManage/NewDogCureTable.js
