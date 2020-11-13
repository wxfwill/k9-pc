import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import * as systomState from 'actions/systomStatus';
import {
  Row,
  Col,
  Icon,
  Spin,
  Button,
  Table,
  Card,
  Input,
  Collapse,
  Tag,
  Tabs,
  Affix,
  message,
  Popconfirm,
} from 'antd';
import GridTable from './RoundsTrackGridTable';
import TaskInfoListView from './TaskInfoListView';
import { tMap } from 'components/view/common/map';
import httpAjax from 'libs/httpAjax';
const Panel = Collapse.Panel;
const Search = Input.Search;
const antIcon = <Icon type="loading" style={{ fontSize: 30 }} spin />;
const TabPane = Tabs.TabPane;

require('style/view/monitoring/gridRaid.less');

class RoundsTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null,
      loading: true,
      cardWidth: 560,
      taskStatus: '',
      display: 'block',
      UAVdisplay: 'block',
    };
    this.playUrl = ''; //视频路径
    this.player = null; //视频播放器
    this.heartbeatFlag = ''; //视频路径是否过期

    this.UAVplayer = null; //无人机视频
  }

  componentWillMount() {
    let { unfold } = this.props.systomActions;
    unfold(true);
  }

  componentDidMount() {
    let _this = this;
    this.timmer = setTimeout(function () {
      _this.setState({
        loading: false,
      });
    }, 1000);

    let options = {
      labelText: '我的位置',
    };

    let TMap = new tMap(options);
    TMap.setBeatMark();
    TMap.setPolyline();
    _this.TMap = TMap;
    this.fetch(); //加载数据

    this.getTaskInfo = function () {
      return _this._taskInfo;
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timmer);
    clearTimeout(this.heartbeatFlag);
    clearInterval(this.playUrl);
  }

  handleLimit = (limit) => {
    this.setState({ limit: limit });
  };

  fetch(params = { id: this.props.match.params.taskID }) {
    // /api/dailyPatrols/getDailyPatrolsById
    let url = '/api/cmdMonitor/emergencyDeploymentPlanInfo',
      type = '';
    if (this.props.location.query && this.props.location.query.type == 'duty') {
      url = '/api/dailyPatrols/getDailyPatrolsById';
      type = this.props.location.query.type;
    }

    var me = this;
    this.setState({ loading: true });
    httpAjax('post', config.apiUrl + url, { ...params, ...this.state.filter })
      .then((res) => {
        //var gmtCreate = new Date(ti.gmtCreate);
        //ti.gmtCreate=gmtCreate.Format("yyyy-MM-dd hh:mm:ss");
        me._taskInfo = res.data;
        me.setState({
          taskStatus: res.data.taskStatus,
        });
        if (!type) {
          var circle = new qq.maps.Circle({
            map: me.TMap.map,
            strokeColor: '#DC143C',
            radius: me._taskInfo.drawShapeDTO.bdRadius,
            center: new qq.maps.LatLng(me._taskInfo.drawShapeDTO.coord.lat, me._taskInfo.drawShapeDTO.coord.lng),
            zIndex: 0,
            visible: true,
            strokeWeight: 2,
          });
          //根据指定的范围调整地图视野
          me.TMap.map.setCenter(
            new qq.maps.LatLng(me._taskInfo.drawShapeDTO.coord.lat, me._taskInfo.drawShapeDTO.coord.lng)
          );
          //  me.TMap.map.fitBounds(circle.getBounds());
        } else {
          me.TMap.drawingPolygon(res.data.drawShapeDTO.latLngArr, 'asd');
          me.TMap.map.setCenter(
            new qq.maps.LatLng(res.data.drawShapeDTO.latLngArr[0].lat, res.data.drawShapeDTO.latLngArr[0].lng)
          ); //根据指定的范围调整地图视野
        }
      })
      .catch(function (error) {
        me.setState({ loading: false });
      });
  }

  drawTrace = (gpsData, pageNo, strokeColor) => {
    //绘制轨迹

    var path = [];
    if (gpsData.length > 0) {
      gpsData.forEach((item, index) => {
        path.push(new qq.maps.LatLng(item.lat, item.lng));
      });

      new qq.maps.Polyline({
        map: this.TMap.map,
        path: path,
        strokeColor: strokeColor,
        strokeWeight: 4,
      });

      if (typeof pageNo != undefined && pageNo == 1) {
        //当是第一页的时候,将地图移动绘制轨迹的第一个点
        this.TMap.map.panTo(new qq.maps.LatLng(path[0].lat, path[0].lng));
      }
    }
  };
  handleShow() {
    let { cardWidth } = this.state;
    this.setState({
      cardWidth: cardWidth == 0 ? 560 : 0,
    });
  }

  /**开始/结束任务**/
  beginOrStopTask = (type) => {
    let msg = '任务已开始！';
    if (type == 1) {
      msg = '任务已结束！';
    }
    let url = type == 1 ? '/api/cmdMonitor/stopEmergency' : '/api/cmdMonitor/beginEmergency';
    if (this.props.location.query && this.props.location.query.type == 'duty') {
      url = type == 1 ? '/api/cmdMonitor/stopPatrols' : '/api/cmdMonitor/beginPatrols';
    }
    let status = type == 0 ? 1 : 2;
    httpAjax('post', config.apiUrl + url, { id: this.props.match.params.taskID })
      .then((res) => {
        this.setState({
          taskStatus: status,
        });
        message.success(msg);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //地点搜索
  onSearch = (value) => {
    this.TMap.searchService().search(value);
  };

  //开启视频设备
  startVideo = (id) => {
    httpAjax('post', config.apiUrl + '/api/sdjw/startVideo', { id: id })
      .then((res) => {
        if (res.code == 0) {
          this.getPlayUrl(id);
        }
      })
      .catch(function (error) {
        message.info(error.msg);
      });
  };

  //获取视频路径
  getPlayUrl = (id) => {
    let { display } = this.state;
    httpAjax('post', config.apiUrl + '/api/sdjw/getPlayUrl', { id: id })
      .then((res) => {
        if (res.code == 0) {
          if (res.data.url == '') {
            if (this.playUrl == '') {
              this.playUrl = setInterval(this.getPlayUrl, 3000, id);
            }
          } else {
            document.getElementById('playerDiv').innerHTML = '';
            document.getElementById('playerDiv').innerHTML =
              '<div  id="player" style="display:block;width:450px;height:320px;margin-bottom:100"></div>';
            this.player = null;
            if (this.player) {
              this.player.load({
                sources: [{ type: 'video/flash', src: res.data.url }],
              });
            } else {
              this.player = new flowplayer('#player', {
                autoplay: true,
                clip: {
                  provider: 'rtmp',
                  sources: [{ type: 'video/flash', src: res.data.url }],
                },
              });
            }
            clearInterval(this.playUrl);
            clearInterval(this.heartbeatFlag);
            this.heartbeatFlag = setInterval(this.heartbeat, 60000, id);
            this.playUrl = '';
          }
          console.log(this.player);
        } else {
          message.info(res.msg);
        }
      })
      .catch(function (error) {});
  };

  //判断视频路径是否过期
  heartbeat = (id) => {
    httpAjax('post', config.apiUrl + '/api/sdjw/heartbeat', { id: id })
      .then((res) => {})
      .catch(function (error) {});
  };

  //视频
  showVideo = (e, id) => {
    //   debugger
    e.stopPropagation();
    this.setState({
      display: 'block',
    });
    this.startVideo(id);
  };

  //关闭视频
  closeVideo = () => {
    this.setState({
      display: 'none',
      UAVdisplay: 'none',
    });
  };
  //无人机视频
  showUAV = () => {
    if (this.UAVplayer == null) {
      httpAjax('post', config.apiUrl + '/api/basicData/liveUrl', {})
        .then((res) => {
          if (res.code == 0) {
            this.UAVplayer = new flowplayer('#UAVDplayer', {
              autoplay: true,
              clip: {
                provider: 'rtmp',
                sources: [{ type: 'video/flash', src: res.data }],
              },
            });
          }
        })
        .catch(function (error) {
          message.info(error.msg);
        });
    } else {
      this.setState({
        UAVdisplay: 'block',
      });
    }
  };
  render() {
    const { collapsed } = this.props.systomState;
    const { cardWidth, taskStatus, display, UAVdisplay } = this.state;
    let type = '',
      title = <span>紧急调配</span>;
    let videoStr = '';
    let UAVStr = '';
    let stopStr =
      taskStatus < 2 ? (
        taskStatus == 0 ? (
          <Tag color="#108ee9" onClick={() => this.beginOrStopTask(0)} style={{ float: 'right' }}>
            开始任务
          </Tag>
        ) : (
          <Popconfirm title="确认终止此任务信息?" onConfirm={() => this.beginOrStopTask(1)}>
            <Tag color="#f50" style={{ float: 'right' }}>
              结束任务
            </Tag>
          </Popconfirm>
        )
      ) : null;
    if (this.props.location.query) {
      type = this.props.location.query.type;
      type == 'duty'
        ? (UAVStr = (
            <Tag color="#108ee9" onClick={() => this.showUAV()} style={{ float: 'right' }}>
              无人机视频
            </Tag>
          ))
        : null;
      type == 'duty'
        ? (videoStr = (
            <Tag color="" onClick={() => this.closeVideo()} style={{ float: 'right' }}>
              关闭视频
            </Tag>
          ))
        : null;
      type == 'duty' ? (title = <span>日常巡逻</span>) : (title = <span>紧急调配</span>);
    }
    const topStr = (
      <div style={{ marginTop: 2 }}>
        {title}
        {stopStr}
        {videoStr}
        {UAVStr}
      </div>
    );
    return (
      <div>
        <div className="GridRaid" style={{ left: collapsed ? '92px' : '212px' }}>
          <Spin
            indicator={antIcon}
            size="large"
            tip="数据加载中..."
            spinning={this.state.loading}
            style={{ position: 'absolute', top: '50%', left: '50%', zIndex: '9999' }}
          />
          <Row gutter={24} id="container">
            <span className="p-icon" style={{ right: cardWidth }} onClick={this.handleShow.bind(this)}>
              <Icon type={cardWidth == 0 ? 'left' : 'right'} />
            </span>
            <Card
              title={topStr}
              bordered={false}
              extra={
                <Tag color="#2db7f5" onClick={this.props.history.goBack}>
                  <Icon type="rollback" />
                  返回
                </Tag>
              }
              bordered
              style={{
                width: cardWidth,
                position: 'absolute',
                top: '0',
                right: '0',
                bottom: 10,
                zIndex: '9999',
                height: '100%',
              }}
            >
              <Search placeholder="地点搜索" onSearch={(value) => this.onSearch(value)} enterButton />
              <Tabs defaultActiveKey="1">
                <TabPane tab="查询轨迹" key="1">
                  <GridTable
                    taskID={this.props.match.params.taskID}
                    taskStatus={taskStatus}
                    type={type}
                    showVideo={this.showVideo}
                    drawTrace={this.drawTrace}
                  />
                </TabPane>
                <TabPane tab="查看任务详情" key="2">
                  <TaskInfoListView getTaskInfo={this.getTaskInfo} />
                </TabPane>
              </Tabs>
            </Card>
            {cardWidth == 0 ? (
              <Affix style={{ position: 'absolute', top: 18, right: 10 }}>
                <Button type="primary" onClick={this.props.history.goBack}>
                  <Icon type="rollback" />
                  返回
                </Button>
              </Affix>
            ) : null}
          </Row>
        </div>
        <div
          id="playerDiv"
          style={{ left: collapsed ? '92px' : '212px', position: 'absolute', top: 81, display: display }}
        >
          <div style={{ display: 'block', width: '450px', height: '320px', marginBottom: '100' }} id="player"></div>
        </div>

        <div
          id="UAVDiv"
          style={{ left: collapsed ? '92px' : '212px', position: 'absolute', bottom: 20, display: UAVdisplay }}
        >
          <div style={{ display: 'block', width: '450px', height: '320px', marginBottom: '100' }} id="UAVDplayer"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  systomState: state.system,
});

const mapDispatchToProps = (dispatch) => ({
  // systomActions: bindActionCreators(systomState,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RoundsTrack);

// WEBPACK FOOTER //
// ./src/components/view/monitoring/RoundsTrack/RoundsTrack.js
