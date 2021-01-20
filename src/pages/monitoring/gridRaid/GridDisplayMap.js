import React, {Component} from 'react';
import {Menu, Dropdown, Layout, Icon, Input, Checkbox, message} from 'antd';
import {withRouter} from 'react-router-dom';
import classNames from 'classnames';
import HeaderComponent from 'components/HeaderComponent';
import {connect} from 'react-redux';
import SocketPlugin from 'util/websocket.js';
import {wsInstance} from 'store/actions/common';
import NoData from 'components/NoData/index.js';

require('style/index.less');
require('style/pages/GridDisplayMap.less');

class GridMap extends Component {
  constructor(props) {
    super(props);
    let userInfo = this.props.userinfo;
    let url = userInfo && `${process.env.BASE_WS}/ws/webSocket/${userInfo.id}`;
    this.socket = new SocketPlugin({url, onMessage: this.handleOnMessage});
    this.props.socketAction(this.socket);
    this.state = {
      map: null, // 地图实例
      existTrack: [], // 已有轨迹
      allAereaInfo: [], // 全部网格信息
      selectKey: null,
      searchVal: undefined,
      eleItem: false,
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      dropList: [],
      selectName: '全部区域',
      selecId: '',
      taskPoint: [], // 初始化任务点
      allAreaUser: [], // 区域人员
      plainOptions: [],
      wdetalParm: {
        taskId: null,
        subTaskId: null,
        userTaskId: null,
        userName: null,
        queryParam: null
      },
      wsPar: {
        taskId: null,
        subTaskId: null,
        userTaskId: null,
        startSecond: null,
        endSecond: null
      },
      tracks: []
    };
  }
  componentDidMount() {
    let taskId = util.urlParse(this.props.location.search).taskId;
    if (taskId) {
      let obj = Object.assign({}, this.state.wdetalParm, {taskId});
      this.setState({wdetalParm: obj}, () => {
        this.getTaskDetal(this.state.wdetalParm);
      });
    } else {
      message.info('taskId不存在');
    }
  }
  handleOnMessage = (data) => {
    console.log('消息来了额');
    console.log(data);
    let resData = data;
    // 已有轨迹
    if (resData && resData.code == 0 && resData.serviceCode == 'queryGridHuntingLocation') {
      console.log('已有轨迹');
      console.log(resData.data);
      this.setState({existTrack: resData.data});
      this.addTrackLine(this.state.map, resData.data);
    }
    // 服务端推送新增轨迹
    if (resData && resData.code == 0 && resData.serviceCode == 'pushGridHuntingLocation') {
      console.log('服务端推送轨迹');
      console.log(resData.data);
      let resArr = resData.data;
      if (resArr && resArr.length > 0) {
        resArr.map((item) => {
          this.updateTrackLine(this.state.map, item.userName, item.tracks);
        });
      }
    }
  };
  getTaskDetal = (obj) => {
    React.$ajax.postData('/api/grid-hunting/queryTaskInfo', {...obj}).then((res) => {
      if (res && res.code === 0) {
        console.log(res.data);
        let resData = res.data;
        this.setState(
          {taskPoint: [parseFloat(resData.taskPoint.lng), parseFloat(resData.taskPoint.lat)], allAereaInfo: resData},
          () => {
            let {taskPoint} = this.state;
            // console.log(taskPoint);
            new K9('rootMap', taskPoint, 12, (instance) => {
              // console.log(instance);
              this.setState({map: instance});
              // 绘制网格
              this.drawGridMap(instance, resData.gridHuntingSubTasks);
              // 绘制全部网格轨迹
              let obj1 = Object.assign({}, this.state.wsPar, {
                taskId: util.urlParse(this.props.location.search).taskId
              });
              this.setState({wsPar: obj1}, () => {
                let {wsPar} = this.state;
                // 发送
                this.socket.send({serviceCode: 'queryGridHuntingLocation', payload: JSON.stringify(wsPar)});
              });
            });
          }
        );
      }
    });
  };
  // 格式化经纬度坐标
  formatLatIng = (data) => {
    let arr = [];
    if (data && data.length > 0) {
      data.map((item) => {
        item.lng && item.lat && arr.push([parseFloat(item.lng), parseFloat(item.lat)]);
        item.longitude && item.latitude && arr.push([parseFloat(item.longitude), parseFloat(item.latitude)]);
      });
    }
    return arr;
  };
  // 地图绘制网格
  drawGridMap = (map, data) => {
    let boxs = [],
      users = [],
      areaArr = [{key: null, name: '全部区域'}],
      defauleCheckList = [];
    if (data && data.length > 0) {
      data.map((item) => {
        // 绘制网格
        boxs.push({
          name: item.subTaskNumber,
          bbox: this.formatLatIng(item.subTaskArea),
          opacity: 0.1,
          strokeWeight: 3
        });
        // 人员
        users = [...users, ...item.gridHuntingUserTasks];
        // 区域
        areaArr.push({
          key: item.subTaskId,
          name: '网格' + item.subTaskNumber
        });
      });
      users.map((item) => {
        item.checked = true;
      });
    }
    map.addBoxes(boxs);
    this.setState({allAreaUser: users}, () => {
      let {allAreaUser} = this.state;
      console.log(allAreaUser);
      // arr = [];
      allAreaUser.map((item) => {
        defauleCheckList.push(item.userTaskId);
      });
      this.setState({dropList: areaArr, checkedList: defauleCheckList}, () => {
        let {checkedList} = this.state;
        this.setState({
          indeterminate: !!checkedList.length && checkedList.length < this.state.allAreaUser.length,
          checkAll: checkedList.length === this.state.allAreaUser.length
        });
      });
    });
  };
  // 添加多人轨迹
  addTrackLine = (map, data) => {
    let trArr = [];
    if (data && data.length > 0) {
      data.map((item) => {
        trArr.push({
          name: item.userName,
          paths: this.formatLatIng(item.tracks),
          color: item.userType == 1 ? '#FF8226' : item.userType == 2 ? '#35C58B' : '#FF8226',
          lineWidth: 3
        });
      });
    }
    console.log(trArr);
    map.addTracks(trArr);
  };
  //添加1个人的轨迹
  addOneTrackLine = (item) => {
    let {existTrack} = this.state,
      arr = null;
    if (existTrack && existTrack.length > 0) {
      existTrack.map((ele) => {
        if (ele.userName == item.userName) {
          arr = ele.tracks;
        }
      });
    }
    let obj = {
      name: item.userName,
      paths: arr ? this.formatLatIng(arr) : [],
      color: item.userType == 1 ? '#FF8226' : item.userType == 2 ? '#35C58B' : '#FF8226',
      lineWidth: 3
    };
    this.state.map.addTracks([obj]);
  };
  // 删除网格和轨迹
  clearAllInfo = () => {
    this.state.map.removeBox();
    this.state.map.removeTrack();
  };
  // 删除轨迹
  delTrackLine = (map, name) => {
    name && map.removeTrack(name);
  };
  // 更新轨迹
  updateTrackLine = (map, name, data) => {
    console.log(data);
    let res = this.formatLatIng(data);
    console.log(res);
    // console.log([parseFloat(data.longitude), parseFloat(data.latitude)]);
    map.appendTrack(name, res);
  };
  handleDrop = (item) => {
    console.log(item);
    let users = [],
      boxs = [],
      defauleCheckList = [];
    let {wdetalParm} = this.state;
    let obj = Object.assign({}, wdetalParm, {subTaskId: item.key});
    this.setState({wdetalParm: obj, selectKey: item.key, selectName: item.item.props.name});
    // debugger;
    // 全部网格
    if (item.key == 'null') {
      let {allAereaInfo} = this.state;
      // 绘制网格
      this.drawGridMap(this.state.map, allAereaInfo.gridHuntingSubTasks);
      let allGrid = Object.assign({}, this.state.wsPar, {
        taskId: util.urlParse(this.props.location.search).taskId
      });
      console.log(allGrid);
      // 添加轨迹
      this.socket.send({serviceCode: 'queryGridHuntingLocation', payload: JSON.stringify(allGrid)});
      return;
    }
    // 清楚网格信息
    this.clearAllInfo();
    // 筛选网格信息
    console.log(this.state.allAereaInfo);
    let {allAereaInfo} = this.state;
    if (allAereaInfo && allAereaInfo.gridHuntingSubTasks.length > 0) {
      console.log(allAereaInfo.gridHuntingSubTasks);
      allAereaInfo.gridHuntingSubTasks.map((ele) => {
        if (ele.subTaskId == item.key) {
          // 绘制网格
          boxs.push({
            name: ele.subTaskNumber,
            bbox: this.formatLatIng(ele.subTaskArea),
            opacity: 0.1,
            strokeWeight: 3
          });
          this.state.map.addBoxes(boxs);
          // 网格人员
          users = ele.gridHuntingUserTasks;
          users.map((n) => {
            n.checked = true;
          });
          this.setState({allAreaUser: users}, () => {
            let {allAreaUser} = this.state;
            console.log(allAreaUser);
            // arr = [];
            allAreaUser.map((item) => {
              defauleCheckList.push(item.userTaskId);
            });
            // console.log(defauleCheckList);
            this.setState({checkedList: defauleCheckList});
          });
          // 轨迹
          let obj2 = Object.assign({}, this.state.wsPar, {
            taskId: util.urlParse(this.props.location.search).taskId,
            subTaskId: item.key
          });
          // 发送
          this.socket.send({serviceCode: 'queryGridHuntingLocation', payload: JSON.stringify(obj2)});
        }
      });
    }
  };
  dropMenu = () => {
    return this.state.dropList && this.state.dropList.length > 0 ? (
      <Menu onClick={this.handleDrop} selectable>
        {this.state.dropList.map((item) => {
          return (
            <Menu.Item key={item.key} name={item.name}>
              <span className="cursor">{item.name}</span>
            </Menu.Item>
          );
        })}
      </Menu>
    ) : null;
  };
  onChange = (checkedList) => {
    // console.log(checkedList);
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.state.plainOptions.length,
      checkAll: checkedList.length === this.state.plainOptions.length
    });
  };
  handleItemUser = (item) => {
    console.log(item);
  };
  onCheckAllChange = (e) => {
    console.log(e);
    // const arr = [];
    let {allAreaUser, existTrack} = this.state;
    if (e.target.checked) {
      allAreaUser.map((item) => {
        // arr.push(item.userTaskId);
        item.checked = true;
      });
      this.addTrackLine(this.state.map, existTrack);
    } else {
      allAreaUser.map((item) => {
        item.checked = false;
      });
      this.state.map.removeTrack();
    }

    this.setState({
      allAreaUser,
      // checkedList: e.target.checked ? arr : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };
  handleItemEle = (e, item) => {
    console.log(e.target.checked);
    console.log(item);
    let {checkedList} = this.state;
    this.state.allAreaUser.map((ele) => {
      if (item.userName == ele.userName) {
        item.checked = !item.checked;
      }
    });
    let obj = this.state.allAreaUser;

    if (e.target.checked) {
      // 选中
      checkedList.push(item.userTaskId);
      // 增加轨迹
      this.addOneTrackLine(item);
    } else {
      let inx = checkedList.findIndex((elment) => elment == item.userTaskId);
      if (inx > -1) {
        checkedList.splice(inx, 1);
      }
      // 删除轨迹
      this.delTrackLine(this.state.map, item.userName);
    }
    this.setState({
      allAreaUser: obj,
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.state.allAreaUser.length,
      checkAll: checkedList.length === this.state.allAreaUser.length
    });
  };
  queryGroupUser = util.Debounce(
    (keyword) => {
      console.log(keyword);
      if (!keyword) return;
      React.$ajax.postData('/api/grid-hunting/queryTaskInfo', {...keyword}).then((res) => {
        if (res.code == 0) {
          let resData = res.data;
          let users = [],
            defauleCheckList = [];
          console.log(resData);
          resData.gridHuntingSubTasks.map((item) => {
            users = [...users, ...item.gridHuntingUserTasks];
          });
          users.map((item) => {
            item.checked = true;
          });

          this.setState({allAreaUser: users}, () => {
            let {allAreaUser} = this.state;
            console.log(allAreaUser);

            allAreaUser.map((item) => {
              defauleCheckList.push(item.userTaskId);
            });
            this.setState({checkedList: defauleCheckList}, () => {
              let {checkedList} = this.state;
              this.setState({
                indeterminate: !!checkedList.length && checkedList.length < this.state.allAreaUser.length,
                checkAll: checkedList.length === this.state.allAreaUser.length
              });
            });
          });
          // this.setState({allAreaUser: arr});
        }
      });
    },
    300,
    false
  );
  handleChangeInput = (event) => {
    const val = event.target;
    // console.log(val.value);
    // console.log(this.state.subTaskId);
    let {wdetalParm} = this.state;
    wdetalParm.queryParam = val.value ? val.value : null;
    this.setState({wdetalParm}, () => {
      console.log(this.state.wdetalParm);
      this.queryGroupUser(this.state.wdetalParm);
    });
  };
  async handleChangeNumber(e) {
    e.persist();
    console.log(e);
    return e;
  }
  render() {
    return (
      <Layout className={classNames('indexComponent')} style={{height: '100%'}}>
        <HeaderComponent isShowCollaps={false} />
        <Layout style={{height: 'calc(100% - 64px)'}}>
          <div className="rootMap">
            <div className="leftMap" id="rootMap"></div>
            <div className="rightOption">
              <div className="dropdown-wrap">
                <Dropdown overlay={this.dropMenu()} trigger={['click']} placement="bottomCenter">
                  <span className="cursor">
                    <i className="text">{this.state.selectName}</i>
                    <Icon type="down" />
                  </span>
                </Dropdown>
                <Input
                  className="input-wrap"
                  placeholder="请输入姓名或警号搜索"
                  key={this.state.selectKey}
                  prefix={<Icon type="search" style={{color: '#BBBCBD'}} />}
                  onChange={(event) => this.handleChangeNumber(event).then(this.handleChangeInput)}
                  allowClear></Input>
              </div>

              <div className="all-checkout">
                <div style={{display: this.state.allAreaUser.length > 0 ? 'block' : 'none'}}>
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}>
                    显示轨迹(默认全部)
                  </Checkbox>
                </div>
                <div className="check-list">
                  {this.state.allAreaUser && this.state.allAreaUser.length ? (
                    this.state.allAreaUser.map((item, index) => {
                      return (
                        <div className="user" key={index}>
                          <Checkbox onChange={(e) => this.handleItemEle(e, item)} checked={item.checked}>
                            <div className="user-list">
                              <img src={require('images/one.jpg')} alt="user" className="user" />
                              <div className="user-con">
                                <p className="desc">
                                  <span className="name">
                                    {item.userName}{' '}
                                    <i style={{display: item.userType == 1 ? 'inline-block' : 'none'}}>队长</i>
                                  </span>
                                  <span className="hb">
                                    海拔：<i>{item.elevation ? parseFloat(item.elevation).toFixed(2) : '无'}</i>
                                  </span>
                                </p>
                                <p className="time">
                                  最新定位时间:
                                  <i>
                                    {item.locTime
                                      ? util.formatDate(new Date(item.locTime), 'yyyy-MM-dd hh:mm:ss')
                                      : '无'}
                                  </i>
                                </p>
                              </div>
                            </div>
                          </Checkbox>
                        </div>
                      );
                    })
                  ) : (
                    <NoData></NoData>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  userinfo: state.loginReducer.userInfo
});
const mapDispatchToProps = (dispatch) => ({
  socketAction: (ws) => dispatch(wsInstance(ws))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GridMap));
