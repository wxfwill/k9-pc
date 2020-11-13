import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import moment from 'moment';
import { List, message, Avatar } from 'antd';
import { tMap } from 'components/view/common/map';
import GridTable from './GridTaskTrackGridTable';
import TaskInfoListView from './GridTaskTaskInfoListView';
import httpAjax from 'libs/httpAjax';

require('style/view/monitoring/gridRaidRealTime.less');
const two = require('images/two.jpg');
var getRandomColor = function () {
  return '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).slice(-6);
};
class ViewGridRaidRealTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      realID: null,
      detail: null,
      personnelList: null, //每个人的所有信息
      parts: 5,
      allPathsHis: null, //每个人的纯粹轨迹信息及子任务id
    };
  }

  getGridTaskById() {
    //根据id请求数据
    let _this = this;
    return httpAjax('post', config.apiUrl + '/api/cmdMonitor/getGridTaskById', {
      taskId: this.props.match.params.realID,
    })
      .then((res) => {
        if (res.code == 0) {
          this.setState({
            detail: res.data,
            personnelList: res.data.details,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showAllAppTrochoidHis(taskType) {
    //根据任务ID及任务类型 获取所有人员的轨迹信息
    let _this = this;
    return httpAjax('post', config.apiUrl + '/api/cmdMonitor/showAllAppTrochoidHis', {
      taskId: this.props.match.params.realID,
      taskType,
    })
      .then((res) => {
        if (res.code == 0) {
          this.setState({
            allPathsHis: res.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  qryTrochoidById(trackId, taskDetailId, userId) {
    // 获取“后续”轨迹信息
    let _this = this;
    let { allPathsHis } = _this.state;
    return httpAjax('post', config.apiUrl + '/api/cmdMonitor/showTrochoid', { id: trackId, taskDetailId })
      .then((res) => {
        if (res.code == 0) {
          let newAllPathsHis = JSON.parse(JSON.stringify(allPathsHis));
          newAllPathsHis.forEach((ele) => {
            if (ele.userId == userId) {
              if (!_.isEmpty(ele.pathsHis)) {
                //当前人员已有轨迹数据拼接轨迹点
                ele.pathsHis[ele.pathsHis.length - 1].push(...res.data[0]);
              } else {
                //当前某个人员没有轨迹信息
                ele.pathsHis.push(res.data[0]);
              }
            }
          });
          _this.setState({ allPathsHis: newAllPathsHis });
          _this.polylineHandle(_this.state.allPathsHis, 1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  polylineHandle(allPathsHis, flag) {
    //画轨迹
    let _this = this;
    allPathsHis.forEach((item, index) => {
      //item 每个人的规矩
      _this['Polyline' + item.userId + item.taskDetailId] &&
        _this['Polyline' + item.userId + item.taskDetailId].setMap(null);
      item.pathsHis.forEach((ite, inde) => {
        //ite每个人多段轨迹
        var path = [];
        ite.forEach((it, ind) => {
          path.push(new qq.maps.LatLng(it.lat, it.lng));
          if (inde == item.pathsHis.length - 1 && ind == ite.length - 1) {
            _this['marker' + item.userId + item.taskDetailId] &&
              _this['marker' + item.userId + item.taskDetailId].setMap(null);
            // //创建一个当前位置Marker
            _this['marker' + item.userId + item.taskDetailId] = new qq.maps.Marker({
              //设置Marker的位置坐标
              position: new qq.maps.LatLng(it.lat, it.lng),
              //设置显示Marker的地图
              map: _this.TMap.map,
            });
            //size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，
            //anchor是锚点坐标，描述经纬度点对应图标中的位置
            var anchor = new qq.maps.Point(0, 39),
              size = new qq.maps.Size(42, 68),
              origin = new qq.maps.Point(0, 0),
              icon = new qq.maps.MarkerImage(
                'http://img4.imgtn.bdimg.com/it/u=1424133376,3932577232&fm=26&gp=0.jpg',
                size,
                origin,
                anchor
              );
            // marker.setIcon(icon);
          }
        });
        _this['Polyline' + item.userId + item.taskDetailId].setMap(_this.TMap.map);
        _this['Polyline' + item.userId + item.taskDetailId].setStrokeColor(item.color);
        _this['Polyline' + item.userId + item.taskDetailId].setPath(path);
      });
    });
  }

  async componentDidMount() {
    let _this = this;
    await _this.getGridTaskById();
    await _this.showAllAppTrochoidHis(_this.state.personnelList[0].taskType);
    let { allPathsHis, detail } = _this.state;
    let options = {
      labelText: '我的位置',
    };
    let TMap = new tMap(options);
    _this.TMap = TMap;

    allPathsHis.forEach((item, index) => {
      _this['Polyline' + item.userId + item.taskDetailId] = new qq.maps.Polyline({
        // path:path,
        map: _this.TMap.map,
        strokeColor: '#1c29d8',
        strokeWeight: 2,
      });
    });

    //根据四点经纬度绘制网格
    await _this.TMap.dotCreateGrid(_this.state.detail.drawShapeDTO.latLngArr, _this.state.detail.drawShapeDTO.parts);
    if (!_.isEmpty(allPathsHis)) {
      //该任务是否有人执行
      allPathsHis.forEach((item, index) => {
        allPathsHis[index].color = getRandomColor();
      });
      _this.setState({
        allPathsHis,
      });
      _this.polylineHandle(allPathsHis);
      _this.timer = setInterval(() => {
        //定时获取轨迹信息
        allPathsHis.forEach((ele) => {
          if (!_.isEmpty(ele.pathsHis)) {
            //当前人员已有轨迹数据拼接轨迹点
            let pathsHisLast = ele.pathsHis[ele.pathsHis.length - 1];
            let insideLast = pathsHisLast[pathsHisLast.length - 1];
            _this.qryTrochoidById(insideLast.id, ele.taskDetailId, ele.userId);
          } else {
            //当前某个人员没有轨迹信息
            _this.qryTrochoidById(null, ele.taskDetailId, ele.userId);
          }
        });
      }, 15000);
    }
  }

  itemHandle() {}

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    let _this = this;
    const { collapsed } = this.props.systomState;
    let { detail, allPathsHis } = this.state;
    return (
      _this.state.allPathsHis && (
        <div className="gridRaidRealTime" style={{ left: collapsed ? '92px' : '212px' }}>
          <div id="container"></div>
          <List
            itemLayout="horizontal"
            dataSource={this.state.allPathsHis}
            renderItem={(item) => (
              <List.Item onClick={this.itemHandle.bind(this)} extra={<img width={27} alt="logo" src={two} />}>
                <span
                  style={{
                    margin: '0 15px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: item.color,
                    borderRadius: '50%',
                  }}
                ></span>
                <List.Item.Meta
                  title={item.userName}
                  description={item.endTime ? moment(item.endTime).format('YYYY-MM-DD HH:mm:ss') : '未开始巡逻'}
                />
              </List.Item>
            )}
          />
        </div>
      )
    );
  }
}
const mapStateToProps = (state) => ({
  systomState: state.system,
});

export default connect(mapStateToProps)(ViewGridRaidRealTime);
