import React, { Component } from 'react';
import { Table, Button, Icon, Popconfirm, message, Card, Row, Col, Avatar, Checkbox, List, Spin, Divider, Badge } from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';

import 'style/app/dogInfo/cardDogList.less'
const { Meta } = Card;

class HouseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dotshow: true,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      pageSize: 2,
      currPage: 1,
      viewDogHouseId: "",
      dogIds: [],
      // 通过“加载更多”加载数据
      listByLoad: {
        loadingMore: false,
        showLoadingMore: false,
        data: []
      }
    }
    this.timer = null;
  }
  componentWillMount() {
    this.setState({ loading: true });
    this.fetch();
    // 在舍状态闪烁点
    let speed = 1000;
    this.timer = setInterval(() => {
      this.ajaxGetDogsInHouse()
    }, speed * 10)
  }

  componentWillReceiveProps(nextProps) {
    if(Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return
    }
    this.setState({ loading: true });
    let filter = nextProps.filter;
    let _this = this;
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
        dogHouseId: filter && filter.dogHouseId
        /*   isExistHouse: filter && filter.isExistHouse, */
      });
    })
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    httpAjax('post', config.apiUrl + '/api/dogRoom/monitor', { ...params }).then((res) => {
      const pagination = { ...this.state.pagination };
      pagination.total = res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      let _total = res.totalCount,
        _currPage = res.currPage,
        _temp = pagination.current + 1,
        _size = this.state.pageSize,
        _show = (_currPage == parseInt(_total / _size) + ((_total % _size) > 0 ? 1 : 0)) || !_total ? false : true
      let _listByLoad = {
        loadingMore: false,
        showLoadingMore: _show,
        data: this.state.listByLoad.data.concat(res.list)
      }

      this.setState({
        loading: false,
        pagination,
        currPage: _temp,
        listByLoad: _listByLoad
      })
      // 取出ids
      let _dogIds = [];
      res.list.map((item) => {
        item.dogListVOList.map((jtem) => {
          if (jtem.id) _dogIds.push(jtem.id)
        })
      })
      this.setState({ dogIds: [..._dogIds, this.state.dogIds] })

    }).catch(function (error) {
      console.log(error);
    })
  }
  // 实时请求警犬在舍情况api
  ajaxGetDogsInHouse = () => {
    const { dogIds } = this.state;
    if (dogIds) {
      httpAjax('post', config.apiUrl + '/api/dogRoom/getDogStatusByIds', { dogIds: dogIds.join(',') }).then((res) => {
        //   let backState = { "1": "0", "2": "1", "3": "0", "9": "", "94": "1" };
        let backState = res || {};
        let sourceData = this.state.listByLoad.data;
        let targetData = [];
        sourceData.map((item) => {
          let temp = item.dogListVOList,
            obj = {},
            i = 0;
          obj.houseName = item.houseName; // 栋数
          for (let j in backState) {
            if (temp[i] && temp[i].id && temp[i].id == j) temp[i].isExistHouse = backState[j];
            i++
          }
          obj.dogListVOList = temp;// 列表
          targetData.push(obj);
        });
        let _listByLoad = {
          loadingMore: this.state.listByLoad.loadingMore,
          showLoadingMore: this.state.listByLoad.showLoadingMore,
          data: targetData
        }
        this.setState({
          listByLoad: _listByLoad
        })
      }).catch((error) => {
        console.log("获取犬只在舍api接口异常" + error)
      })
    }
  }
  // 加载更多
  onLoadMore = () => {
    this.setState({ loading: true });
    const pager = { ...this.state.pagination };
    var nextpage = pager.current = this.state.currPage;
    this.setState({
      pagination: pager,
      currPage: nextpage++
    });
    this.fetch();
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
  // 渲染卡片
  renderCard = (item, index) => {
    return <Card style={{ borderRadius: 5,minHeight:155 }} key={index} hoverable={true} bodyStyle={{padding: '24px 6px'}}>
      <Row>
        <Col xs={24} sm={24} md={5} lg={5} xl={5} xxl={5} >
         <a href={item.videoUrl}><img src={config.apiUrl + `/api/dog/img?id=${item.id}&t=${new Date().getTime()}`} style={{ width: '50px', height: '50px' ,borderRadius:5 }} alt={item.name} /></a>
        </Col>
        <Col xs={24} sm={24} md={19} lg={19} xl={19} xxl={19}>
          <Row className="cardsList-info" >
            <Col xs={9} sm={9} md={10} lg={10} xl={10} xxl={10} ><a href={item.videoUrl}><span style={{ fontWeight: 800, fontSize: 13, color: '#555' }}>{(item.dogName || '-')} <Icon style={{ color: '#1890ff' }} type="video-camera" /></span></a></Col>
            <Col xs={15} sm={15} md={14} lg={14} xl={14} xxl={14} title={item.isExistHouse === '0' ? '未知' : (item.isExistHouse === '1' ? '在犬舍' : '离开中')} style={{ textAlign: 'right' }}>
              {item.isExistHouse === '0' ? (<Badge status="default" text={item.houseRoomStr || '-'}/>) : (item.isExistHouse === '1' ? <Badge status="success" text={item.houseRoomStr || '-'}/> : <div className="roundScale"></div>)} </Col>
          </Row>
          <table className="cardsList-info">
            <tr><td>训导员：</td><td>{(item.trainerName || '-')}</td></tr>
            <tr><td>出生日期：</td><td> {item.birthdayStr}</td></tr>
          </table>
        </Col>
      </Row>
    </Card>
  }

  render() {
    const { loading } = this.state;
    const { loadingMore, showLoadingMore, data } = this.state.listByLoad;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button loading={this.state.loading} onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;

    // 渲染宿舍
    let rendrHouse = data.map((item, i) => {
      return <div key={i} style={{ background: '#fbfbfb', padding: 24 }}>
        <span style={{ fontWeight: 800 }}><i className="iconfont icon-sushe2x"></i> {item.houseName || '-'}犬舍（{item.dogListVOList ? item.dogListVOList.length : '-'}）</span>
        <Divider style={{ margin: '10px auto 20px auto' }}></Divider>
        <List
          loading={loading}
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 4, xl: 4, xxl: 4 }}
          itemLayout="vertical"
          dataSource={item.dogListVOList}
          renderItem={(_item, index) => {
            return <List.Item>{this.renderCard(_item, index)} </List.Item>
          }
          }
        />
      </div>
    })

    return (<div> {rendrHouse}{loadMore}</div>)
  }
}
export default HouseList;
