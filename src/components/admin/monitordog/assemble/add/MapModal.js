import React,{ Component } from 'react';
import { Radio, Form, Input , Modal, Icon, Card ,Spin, Tag, message} from 'antd';
import { tMap } from 'components/view/common/map';
import { Button } from 'element-react';
require('style/view/monitoring/mapModal.less');

class MapModal extends  Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      coordMsg:null,
      drawShapeDTO:null,
      point: {},
    }
    this.mapObj = null;
    this.marker = '';
  }
  componentDidMount() {
    let options = {
      labelText:'我的位置',
    }
    let _this = this;
    this.mapObj = new tMap(options);
    this.mapObj.createMakers((e) => {this.setState({point: e.latLng })},
    (marker) => {
      this.marker&&this.marker.setMap(null);
      this.marker = marker;
    }
  )
    
    this.hideLoading();
  }
  componentWillUnmount(){ 
    this.setState = (state,callback)=>{
      return;
    };  
  }
  handleReset(){
    this.marker&&this.marker.setMap(null);
    this.setState({point:{}});
  }
  hideLoading(){
    let _this = this;
    setTimeout(()=>{
      _this.setState({
        loading:false
      })
    },2000)
  }
  handleShow(){
    this.mapObj.clearCircle();
    this.props.handleShow();
  }
  handleSure(){
    let { point } = this.state;
    let _this = this;
    if(point&&this.marker){
      let address = this.mapObj.resolveLatLng(point,function(address){
        _this.props.handleShow({address, point});
      });
    }else{
      message.warning('请选择目标区域！');
    };
  }
  searchLocation = () => {
    const {searchVal} = this.state;
    const self = this;
    const geocoder = new qq.maps.Geocoder();
    geocoder.getLocation(searchVal);
    geocoder.setComplete(function(result) {
      self.mapObj.map.setCenter(result.detail.location);})
  }
  render(){
    const { changeLeft } = this.props;
    return(
      <div className="MapModal" style={{left:changeLeft?'360px':'100%'}}>
     
        <div className="map-container">
          <Spin spinning={this.state.loading}>
            <Card title={'添加集合点'}>
            <div style={{position: 'absolute', top: 10,right: 10}}>
              <Input style={{width: 300, margin: '0 10px 0 0'}} onChange={(e) => {this.setState({searchVal: e.target.value})}}  />
              <Button type="primary" onClick={this.searchLocation}>搜索</Button>
            </div>
              
              <div className="container" id="container">
                  <Card title={'控制中心'} bordered={false}  bordered style={{ width: 150,position:'absolute',top:'0',right:'0',zIndex:'9999'}}>
                    <Tag onClick={this.handleReset.bind(this)} color="#f50">重新选择</Tag>
                    <Tag onClick={this.handleSure.bind(this)} color="#2db7f5">确 认</Tag>
                  </Card>
              </div>
            </Card>
          </Spin>
        </div>
        <span className="cursor p-icon" onClick={this.handleShow.bind(this)}>
          <Icon type="right"/>
        </span>
      </div>
    )
  }
}

export default MapModal;