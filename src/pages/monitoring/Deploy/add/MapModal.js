import React,{ Component } from 'react';
import { Radio, Form, Input , Modal, Icon, Card ,Spin, Tag, message} from 'antd';
import { tMap } from 'components/view/common/map';
require('style/view/monitoring/mapModal.less');

class MapModal extends  Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      coordMsg:null,
      drawShapeDTO:null
    }
    this.mapObj = null;
  }
  componentDidMount() {
    let options = {
      labelText:'我的位置',
    }
    let _this = this;
    this.mapObj = new tMap(options);
    this.mapObj.drawingCircle((data)=>{
      var drawShapeDTO={
        drawShapeType:'circle',
        radius:data.radius,
        coord:data.coord
      }

      _this.setState({
        coordMsg:data,
        drawShapeDTO:drawShapeDTO
      })
    });
    this.hideLoading();
  }
  componentWillUnmount(){ 
    this.setState = (state,callback)=>{
      return;
    };  
  }
  handleReset(){
    let _this = this;
    this.mapObj.clearCircle();
    this.mapObj.drawingCircle((data)=>{
      var drawShapeDTO={
        drawShapeType:'circle',
        radius:data.radius,
        coord:data.coord
      }

      _this.setState({
        coordMsg:data,
        drawShapeDTO:drawShapeDTO
      })
    });
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
    let { coordMsg,drawShapeDTO } = this.state;
    let _this = this;
    if(coordMsg instanceof Object){
      let address = this.mapObj.resolveLatLng(coordMsg.coord,function(address){
        _this.props.handleShow({subCoord:coordMsg.coord,address:address,drawShapeDTO:drawShapeDTO});
      });
    }else{
      message.warning('请选择目标区域！');
    };
  }
  render(){
    const { changeLeft } = this.props;
    return(
      <div className="MapModal" style={{left:changeLeft?'360px':'100%'}}>
        <div className="map-container">
          <Spin spinning={this.state.loading}>
            <Card title={'添加作战区域'}>
              <div className="container" id="container">
                  <Card title={'控制中心'} bordered={false}  bordered style={{ width: 150,position:'absolute',top:'0',right:'0',zIndex:'9999'}}>
                    <Tag onClick={this.handleReset.bind(this)} color="#f50">重新绘制</Tag>
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