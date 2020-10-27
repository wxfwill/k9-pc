import React, { Component } from 'react';
import { Radio, Form, Input, Modal, Icon, Card, Spin, Tag, message } from 'antd';
import { tMap } from 'components/view/common/map';
import { debug } from 'util';
const Search = Input.Search;
require('style/view/monitoring/mapModal.less');

class MapModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      coordMsg: null,
      drawobj: null,
      drawShapeDTO: null
    }
    this.mapObj = null;
  }
  componentDidMount() {
    let options = {
      labelText: '我的位置',
    }
    let _this = this;
    this.mapObj = new tMap(options);
    this.handleUpdate();
    this.handleDraw();
    this.hideLoading();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  handleReset() {
    let _this = this;
    if (this.state.drawShapeDTO) {
      this.state.coordMsg.setMap(null);
      this.state.drawobj.setMap(null);
      this.setState({ coordMsg: null })
      this.handleDraw();
    }
  }
  hideLoading() {
    let _this = this;
    setTimeout(() => {
      _this.setState({
        loading: false
      })
    }, 2000)
  }

  // 绘制
  handleDraw = () => {
    this.mapObj._drawingPolygon((data, drawobj) => {
      let coordArr = JSON.stringify(data.path.elems)
      var drawShapeDTO = {
        drawShapeType: 'polygon',//多边形
        latLngArr: coordArr, //坐标
        coord: data.getBounds().getCenter() //中心
      }
      this.setState({
        coordMsg: data,
        drawobj: drawobj,
        drawShapeDTO: drawShapeDTO
      })
    });
  }
  // 如果是编辑或者返回修改
  handleUpdate = () => {
    let hasCreat = sessionStorage.getItem("tempPolygonCoords");
    if (hasCreat) {
      let tempCoord = JSON.parse(hasCreat);
      tempCoord.latLngArr = typeof tempCoord.latLngArr == "object" ? tempCoord.latLngArr : JSON.parse(tempCoord.latLngArr);
      this.setState({ drawShapeDTO: tempCoord })
      if (tempCoord) {
        let tempCoordArr = tempCoord.latLngArr,
          targetArr = [];
        tempCoordArr.map((item) => {
          targetArr.push(new qq.maps.LatLng(item.lat, item.lng))
        });

        var polygon = new qq.maps.Polygon({
          path: targetArr,
          map: this.mapObj.map
        });
        this.mapObj.map.setCenter(new qq.maps.LatLng(tempCoord.coord.lat, tempCoord.coord.lng))
        this.setState({ coordMsg: polygon })
      }
    }
  }
  handleShow() {
    this.mapObj.clearCircle();
    this.props.handleShow();
  }
  handleSure() {
    let { coordMsg, drawShapeDTO } = this.state;
    let _this = this;
    if (coordMsg instanceof Object) {
      sessionStorage.setItem("tempPolygonCoords", JSON.stringify(drawShapeDTO));
      let address = this.mapObj.resolveLatLng(drawShapeDTO.coord, function (address) {
        _this.props.handleShow({ address: address, drawShapeDTO: drawShapeDTO });
      });
    } else {
      message.warning('请选择目标区域！');
    };
  }
   //地点搜索
   onSearch =(value)=>{
    this.mapObj.searchService().search(value);
   }
  render() {
    const { changeLeft } = this.props;
    return (
      <div className="MapModal" style={{ left: changeLeft ? '360px' : '100%' }}>
        <div className="map-container">
          <Spin spinning={this.state.loading}>
            <Card title={'添加巡逻地点'}>
              <div className="container" id="container">
                <Card title={'控制中心'} bordered={false} bordered style={{ width: 280, position: 'absolute', top: '0', right: '0', zIndex: '9999' }}>
                  <Search
                    placeholder="地点搜索"
                    onSearch={value => this.onSearch(value)}
                    enterButton
                  />
                  <div style={{textAlign:"center",marginLeft:10}}>
                    <Tag onClick={this.handleReset.bind(this)} color="#f50">重新绘制</Tag>
                    <Tag onClick={this.handleSure.bind(this)} color="#2db7f5">确 认</Tag>
                  </div>
                </Card>
              </div>
            </Card>
          </Spin>
        </div>
        <span className="cursor p-icon" onClick={this.handleShow.bind(this)}>
          <Icon type="right" />
        </span>
      </div>
    )
  }
}

export default MapModal;


// WEBPACK FOOTER //
// ./src/components/view/monitoring/AddPatrols/MapModal.js