import React ,{ Component } from 'react';
import { Table, Button , Tag , Badge , Icon, Spin } from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import PrevDetailTable from './PrevDetailTabl'
import { tMap } from 'components/view/common/map';
import moment from 'moment';
import Immutable from 'immutable';

const localSVG = require('images/banglocation.svg');
require('style/view/page/health_tab.less');

class HealthTable extends React.Component {
  constructor(props){
    super(props);
    this.state={
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
      pageSize:10,
      currPage:1,
      data:[],
      loading:false,
      filter:null,
      changeLeft:false,
      showDetail:false
     
    }
    this.TMap = null;
    this.center = {lat: 22.557140481350014, lng: 114.08466517925262};

  }
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if(Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return
    }
    let filter = nextProps.filter;
    let isReset = util.method.isObjectValueEqual(nextProps,this.props);
    if(!isReset){
      let _this = this;
      this.setState({filter, data: []},function(){
        _this.fetch({
          pageSize:_this.state.pageSize,
          currPage:1,
          ...filter
        });
      })
    }
  }
  componentDidMount() {
   

  }
  handleTableChange=(pagination, filters, sorter)=>{
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    let {filter} = this.state;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...filter
    });
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/braceletInfo/sportDataPage',{...params}).then((res)=>{
      const pagination = { ...this.state.pagination };
      pagination.total =res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      let {lat, lng} = this.center;
      
     
      this.setState({totalPage: res.totalPage,
        data:[...this.state.data,...res.list],
        loading:false,pagination
      },() => {
        
        res.list.forEach((item) => {
          if(item.gpsLocation.length>0) {
            lat = item.gpsLocation[0].lat;
            lng = item.gpsLocation[0].lng;
          }
          this.TMap = new tMap({labelText: '',lat, lng, zoom: 13, id: `card_map_${item.id}`});
          const path = item.gpsLocation.map((t) => {
            return new qq.maps.LatLng(t.lat, t.lng);
          });
          this.TMap.drawPolyline({path,strokeWeight: 9,  strokeColor: '#ff0000',});
        })
      })
    }).catch(function(error){
      console.log(error);
    })
  }
  queryDetail=(data)=>{
    this.setState({
      detailTitle:data,
      showDetail:true,
      changeLeft:true
    })
  }
  handleShow(){
    let _this = this;
    this.setState({
      changeLeft:false
    },function(){
      setTimeout(()=>{
        _this.setState({
          showDetail:false
        })
      },600)
    })
  }  
  loadMore = () => {
    const {currPage,pageSize,filter} = this.state;
    this.setState({currPage: currPage+1}, this.fetch({
        currPage: currPage+1,
        pageSize,
        ...filter,
    }))
  }
  render() {
    // console.log(this.state)
  const columns = [{
      title: '序号',
      dataIndex: 'braceletId',
      key: 'braceletId',
      render:id=>{
        return <Badge count={id} style={{minWidth: '50px',fontSize:'12px',height:'16px',lineHeight:'16px', backgroundColor: '#99a9bf' }} /> 
      }
    },
    {
      title: '记录日期',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render:time=>{
        let date = new Date(time);
        let YMD = date.toLocaleString().split(' ')[0];
        // let HMS = date.toString().split(' ')[4];
        let vaccineTime = YMD;
        return vaccineTime
      }
    }, 
    {
      title: '犬名',
      dataIndex: 'dogName',
      key: 'dogName'
    },{
      title: '设备ID',
      dataIndex: 'macAddress',
      key: 'macAddress'
    },{
      title: '能量',
      dataIndex: 'consumeEnergy',
      key: 'consumeEnergy'
    },{
        title: '步数',
        dataIndex: 'steps',
        key: 'steps'
      }
];    
    return (
      <div className="HealthTab">

           {
            this.state.data.map((item) => {
              return  <div className="health_card" key={item.id}>
          <div className="card_header">
            <div className="card_header_h1">
              <span>{item.dogName}</span>
              <span>{moment(new Date(item.uploadDate)).format('YYYY-MM-DD')}</span>
            </div>
            <div className="equipment"> 设备ID：{item.macAddress} </div>
          </div>
          <div className="card_map" >
            <div className="map_div" id={`card_map_${item.id}`}></div>
            <div className="bg_op"></div>
            <div className="step">{item.steps}步</div>
            <div className="cal">{item.consumeEnergy}kcal</div>
            <div className="cal">{item.temperature}℃</div>
          </div>
        </div>
            })
          }
          {
            this.state.totalPage <= this.state.currPage ? '': <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
            {this.state.loading &&  <Spin />} <Button onClick={this.loadMore}>加载更多</Button> </div>
        }
        {
            this.state.data.length == 0 ? <div style={{ textAlign: 'center', color:'#999', marginTop: 12, height: 32, lineHeight: '32px' }}> 暂无数据</div>:''
        }
      </div>
    );
  }
}
export default HealthTable;




// WEBPACK FOOTER //
// ./src/components/view/tables/dog/HealthTab.js