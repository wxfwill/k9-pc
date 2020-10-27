import React, { Component } from 'react';
import { Button, Icon, Popconfirm, message, Card, Row, Col, List, Spin } from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import 'style/app/dogInfo/cardDogList.less'


import Immutable from 'immutable'
class DogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      pageSize: 18,
      currPage: 1,
      selectedRowKeys: [],
      // 通过“加载更多”加载数据
      listByLoad: {
        loadingMore: false,
        showLoadingMore: false,
        data: []
      },
      lastestUploadImg: config.apiUrl + `/api/dog/img?id=${sessionStorage.getItem("dogId")}&t=${new Date().getTime()}`
    }
  }
  componentDidMount() {
    this.setState({ loading: true });
    let params = {   pageSize: this.state.pageSize, currPage: this.state.currPage };
    if(this.props.type =='duty') {
      params.onduty = "1"
    } else if(this.props.type =='service') {
      params.serviceStatus ="0"
    }
    this.fetch(params);
  }
  componentWillReceiveProps(nextProps) {
    if(Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return
    }
    let filter = nextProps.filter;
    let _this = this;
  
    if(filter) {
      this.setState({ loading: true });
      let _listByLoad = {
        loadingMore: false,
        showLoadingMore: false,
        data: []
      }
      this.setState({
        listByLoad: _listByLoad
      })
      this.setState({ filter: filter }, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter,
          trainerIds: filter.trainerIds && filter.trainerIds.map((t) => t.key).join(',')
        });
      })
    } else {
      this.setState({ loading: true });
      let _listByLoad = {
        loadingMore: false,
        showLoadingMore: false,
        data: []
      }
      this.setState({
        listByLoad: _listByLoad
      })
      this.setState({ filter: filter }, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,     
        });
      })
    }
    
  }
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    httpAjax('post', config.apiUrl + '/api/dog/listData', { ...params }).then((res) => {
      const pagination = { ...this.state.pagination };
      pagination.total = res.totalCount;
      pagination.current = res.currPage;
      var temp = pagination.current + 1;
      pagination.pageSize = res.pageSize;

      let _total = res.totalCount,
        _currPage = res.currPage,
        _size = this.state.pageSize,
        _show = (_currPage == parseInt(_total / _size) + ((_total % _size) > 0 ? 1 : 0)) || !_total ? false : true
      //parseInt(_total /_size) + ((_total % _size) > 0 ? 1 : 0)
      let _listByLoad = {
        loadingMore: false,
        showLoadingMore: _show,
        data: this.state.listByLoad.data.concat(res.list)
      }
      this.setState({
        loading: false,
        pagination,
        currPage: temp,
        listByLoad: _listByLoad
      })
      this.addInfo();
    }).catch(function (error) {
      console.log(error);
    })
  }

  // 加载更多
  onLoadMore = () => {
    this.setState({ loading: true });
    const pager = { ...this.state.pagination };
    var nextpage = pager.current = this.state.currPage;
    if(this.state.filter){
      this.fetch({
        pageSize: this.state.pageSize,
        currPage: nextpage++,
        ...this.props.filter,
        trainerIds: this.props.filter.trainerIds && this.props.filter.trainerIds.map((t) => t.key).join(',')
      });
    }else{
      this.setState({
        pagination: pager,
        currPage: nextpage++
      });
      this.fetch();
    }
  }

  onSelectChange = (selectedRowKeys) => {
    //console.log(selectedRowKeys)
    this.setState({ selectedRowKeys })
  }
  //删除犬只
  deleteDogs = (id, index) => { 

    httpAjax('post', config.apiUrl + '/api/dog/deleteByIds', { ids: [id] }).then(res => {
      if (res.code == 0) {
        message.success("删除成功");
        this.setState({
          currPage: 1,
          listByLoad: {
            data: [],
          }
        }, this.fetch({
          pageSize: this.state.pageSize,
          currPage:1
        }))
        
      } else {
        message.serror("删除失败")
      }
    })
  }
  //批量删除
  deleteMore = () => {
    const { selectedRowKeys, pagination } = this.state;
    if (selectedRowKeys.length < 1) {
      message.warn("请选择要删除的犬只")
    } else {
      httpAjax('post', config.apiUrl + '/api/dog/deleteByIds', { ids: selectedRowKeys }).then(res => {
        if (res.code == 0) {
          message.success("删除成功");
          this.fetch({
            pageSize: pagination.pageSize,
            currPage: pagination.current
          });
        } else {
          message.error("删除失败");
        }
      })
    }
  }
  addInfo = () => {
    sessionStorage.setItem("formStatus", 'add');
    sessionStorage.setItem("dogId", "");
  }
  //查看
  viewDetail = (record) => {
    sessionStorage.setItem("dogId", record.id);
    sessionStorage.setItem("formStatus", 'view');
  }
  editInfo = (record) => {
    sessionStorage.setItem("dogId", record.id);
    sessionStorage.setItem("formStatus", 'edit');
  }
  renderCard = (item, index) => {
    return <Col key={index}>
      <Card style={{ borderRadius: 5, paddingBottom: 1 }} bodyStyle={{padding: '24px 6px'}} hoverable={true}
        actions={[<span onClick={() => this.editInfo(item)}> <Link to={{ pathname: '/app/dog/infoEdit', query: { dogId: item.id, targetText: '编辑' } }}>
          <Icon type='edit' /> 修改 </Link></span>,
        <Popconfirm title='确认删除此犬只信息?' onConfirm={() => this.deleteDogs(item.id)}>
          <Icon type='delete' /> 删除</Popconfirm>, <span onClick={() => this.viewDetail(item)}> <Link to={{ pathname: '/app/dog/infoView', query: { dogId: item.id, targetText: '查看' } }}>
          <Icon type='eye' /> 查看 </Link></span>,]} >
        <Row style={{minHeight:140}}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6} >
            <img src={config.apiUrl + `/api/dog/img?id=${item.id}&t=${new Date().getTime()}`} style={{ width: '80px', height: '80px',borderRadius:5  }} alt={item.name} />
          </Col>
          <div className="cardsList-div">
          <Col xs={24} sm={24} md={18} lg={18} xl={18} xxl={18}>
            <Row className="cardsList-info" >
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} ><span onClick={() => this.viewDetail(item)}><Link to={{ pathname: '/app/dog/infoView', query: { dogId: item.id, targetText: '查看' } }} style={{ color: "#666" }}>{item.name + '-' + item.number}</Link></span></Col>
            </Row>
            <table className="card_title ">
              <tr><td>犬种：</td><td> {item.breedName || '-'}</td></tr>
              <tr><td>出生日期：</td><td>{item.birthdayStr || '-'}</td></tr>
              <tr><td>带犬员：</td><td>{(item.trainerName || '-') + '-' + (item.trainerNumber || '-')}</td></tr>
              <tr><td>芯片号：</td><td> {item.chipCode || '-'}</td></tr>
              <tr><td>服役单位：</td><td><span>{item.serviceUnitName || '-'}</span></td></tr>

            </table>
          </Col>
          </div>
        </Row>
      </Card>
    </Col>
  }

  render() {
    console.log(this.state)
    const { loading, selectedRowKeys } = this.state;
    const { loadingMore, showLoadingMore, data } = this.state.listByLoad;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button loading={this.state.loading} onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;

    return (
      <div style={{ background: '#fbfbfb', padding: 24 }}>
        <div style={{ marginBottom: '20px' }}>
          <Button type='primary' style={{ marginRight: '20px' }} onClick={this.addInfo}>
            <Link to={{ pathname: '/app/dog/infoAdd', query: { targetText: '新增' } }}> <Icon type="plus-circle-o" /> 新增犬只</Link>
          </Button>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>
          <Button onClick={this.deleteMore}>批量删除</Button>*/}
        </div>
        <List
          loading={loading}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={data}
          renderItem={(item, index) => {
            return <List.Item>{this.renderCard(item, index)} </List.Item>
          }
          }
        />
      </div>
    )
  }
}
export default DogTable;



// WEBPACK FOOTER //
// ./src/components/admin/tables/DogManage/DogInforTable.js