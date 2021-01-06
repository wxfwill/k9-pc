import React, {Component} from 'react';
import {Radio, Form, Input, Modal, Icon, Card, Spin, Tag, message} from 'antd';
import {tMap} from 'components/view/common/map';
import {debug} from 'util';
require('style/view/monitoring/mapModal.less');

class MapModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      coordMsg: null,
      drawobj: null,
      drawShapeDTO: null
    };
    this.mapObj = null;
  }
  componentDidMount() {
    const options = {
      labelText: '我的位置'
    };
    const _this = this;
    this.mapObj = new tMap(options);
    this.handleUpdate();
    this.handleDraw();
    this.hideLoading();
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {};
  }
  handleReset() {
    const _this = this;
    if (this.state.drawShapeDTO) {
      this.state.coordMsg.setMap(null);
      this.state.drawobj.setMap(null);
      this.setState({coordMsg: null});
      this.handleDraw();
    }
  }
  hideLoading() {
    const _this = this;
    setTimeout(() => {
      _this.setState({
        loading: false
      });
    }, 2000);
  }

  // 绘制
  handleDraw = () => {
    this.mapObj._drawingPolygon((data, drawobj) => {
      const coordArr = JSON.stringify(data.path.elems);
      var drawShapeDTO = {
        drawShapeType: 'polygon', //多边形
        coord: coordArr, //坐标
        centerCoord: data.getBounds().getCenter() //中心
      };
      this.setState({
        coordMsg: data,
        drawobj: drawobj,
        drawShapeDTO: drawShapeDTO
      });
    });
  };
  // 如果是编辑或者返回修改
  handleUpdate = () => {
    const hasCreat = sessionStorage.getItem('tempPolygonCoords');
    if (hasCreat) {
      const tempCoord = JSON.parse(hasCreat);
      console.log(tempCoord);
      tempCoord.coord = typeof tempCoord.coord === 'object' ? tempCoord.coord : JSON.parse(tempCoord.coord);
      this.setState({drawShapeDTO: tempCoord});
      if (tempCoord) {
        const tempCoordArr = tempCoord.coord;
        const targetArr = [];
        tempCoordArr.map((item) => {
          targetArr.push(new qq.maps.LatLng(item.lat, item.lng));
        });

        var polygon = new qq.maps.Polygon({
          path: targetArr,
          map: this.mapObj.map
        });
        if (tempCoord.centerCoord) {
          this.mapObj.map.setCenter(new qq.maps.LatLng(tempCoord.centerCoord.lat, tempCoord.centerCoord.lng));
        }

        this.setState({coordMsg: polygon});
      }
    }
  };
  handleShow() {
    this.mapObj.clearCircle();
    this.props.handleShow();
  }
  handleSure() {
    const {coordMsg, drawShapeDTO} = this.state;
    const _this = this;
    if (coordMsg instanceof Object) {
      console.log(coordMsg);
      if (drawShapeDTO.centerCoord) {
        sessionStorage.setItem('tempPolygonCoords', JSON.stringify(drawShapeDTO));
        const address = this.mapObj.resolveLatLng(drawShapeDTO.centerCoord, function (address) {
          _this.props.handleShow({address: address, drawShapeDTO: drawShapeDTO});
        });
      } else {
        this.props.handleShow();
      }
    } else {
      message.warning('请选择目标区域！');
    }
  }
  render() {
    const {changeLeft} = this.props;
    return (
      <div className="MapModal" style={{left: changeLeft ? '360px' : '100%'}}>
        <div className="map-container">
          <Spin spinning={this.state.loading}>
            <Card title={'添加训练地点'}>
              <div className="container" id="container">
                <Card
                  title={'控制中心'}
                  bordered={false}
                  bordered
                  style={{width: 150, position: 'absolute', top: '0', right: '0', zIndex: '9999'}}>
                  <Tag onClick={this.handleReset.bind(this)} color="#f50">
                    重新绘制
                  </Tag>
                  <Tag onClick={this.handleSure.bind(this)} color="#2db7f5">
                    确 认
                  </Tag>
                </Card>
              </div>
            </Card>
          </Spin>
        </div>
        <span className="cursor p-icon" onClick={this.handleShow.bind(this)}>
          <Icon type="right" />
        </span>
      </div>
    );
  }
}

export default MapModal;
