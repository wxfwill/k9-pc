import React, {Component} from 'react';
import {Menu, Dropdown, Layout, Icon, Input, Checkbox, message} from 'antd';
import {withRouter} from 'react-router-dom';
import classNames from 'classnames';
import HeaderComponent from 'components/HeaderComponent';
import {createWebsocket, activePushData} from 'util/websocket.js';

require('style/index.less');
require('style/pages/GridDisplayMap.less');

// const CheckboxGroup = Checkbox.Group;

class GridMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eleItem: false,
      checkedList: [],
      indeterminate: false,
      checkAll: true,
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
        userNumber: null
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
  wsPushTrack = (map) => {
    let _this = this;
    // 服务端推送轨迹
    let obj1 = Object.assign({}, this.state.wsPar, {taskId: util.urlParse(this.props.location.search).taskId});
    this.setState({wsPar: obj1}, () => {
      activePushData({serviceCode: 'queryGridHuntingLocation', payload: JSON.stringify(this.state.wsPar)}, (res) => {
        console.log(JSON.parse(res));
        let resData = JSON.parse(res);
        // 已有轨迹
        if (resData && resData.code == 0 && resData.serviceCode == 'queryGridHuntingLocation') {
          console.log('已有轨迹');
          console.log(resData.data);
          _this.addTrackLine(map, resData.data);
        }
        // 服务端推送新增轨迹
        if (resData && resData.code == 0 && resData.serviceCode == 'pushGridHuntingLocation') {
          console.log('服务端推送轨迹');
          console.log(resData.data);
          let resArr = resData.data;
          if (resArr && resArr.length > 0) {
            resArr.map((item) => {
              this.updateTrackLine(map, item.userName, item.tracks);
            });
          }
        }
      });
    });
  };
  getTaskDetal = (obj) => {
    React.$ajax.postData('/api/grid-hunting/queryTaskInfo', {...obj}).then((res) => {
      if (res && res.code === 0) {
        console.log(res.data);
        let resData = res.data;
        this.setState({taskPoint: [parseFloat(resData.taskPoint.lng), parseFloat(resData.taskPoint.lat)]}, () => {
          let {taskPoint} = this.state;
          // console.log(taskPoint);
          new K9('rootMap', taskPoint, 12, (instance) => {
            // console.log(instance);
            // ws
            createWebsocket();
            // 绘制网格
            this.drawGridMap(instance, resData.gridHuntingSubTasks);
            // 绘制轨迹
            this.wsPushTrack(instance);
            // 删除轨迹
            this.delTrackLine(instance);
          });
        });
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
      let {allAreaUser} = this.state,
        arr = [];
      allAreaUser.map((item) => {
        arr.push({label: this.getListTxt(item), value: item.userTaskId});
        defauleCheckList.push(item.userTaskId);
      });
      // console.log(defauleCheckList);
      this.setState({plainOptions: arr, dropList: areaArr, checkedList: defauleCheckList});
      // 渲染列表
      // this.getContentList(allAreaUser);
    });
  };
  // 添加轨迹
  addTrackLine = (map, data) => {
    let trArr = [];
    if (data && data.length > 0) {
      data.map((item) => {
        trArr.push({
          name: item.userName,
          paths: this.formatLatIng(item.tracks),
          // color: '#be1a1d',
          lineWidth: 3
        });
      });
    }
    console.log(trArr);
    map.addTracks(trArr);
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
    console.log(item.key);
    this.setState({selectName: item.item.props.name, selecId: item.key});
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
    let {allAreaUser} = this.state;
    if (e.target.checked) {
      allAreaUser.map((item) => {
        // arr.push(item.userTaskId);
        item.checked = true;
      });
    } else {
      allAreaUser.map((item) => {
        item.checked = false;
      });
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
    } else {
      let inx = checkedList.findIndex((elment) => elment == item.userTaskId);
      if (inx > -1) {
        checkedList.splice(inx, 1);
      }
    }
    console.log(checkedList);
    this.setState({
      allAreaUser: obj,
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.state.allAreaUser.length,
      checkAll: checkedList.length === this.state.allAreaUser.length
    });
  };
  getContentList = (data) => {
    if (data && data.length > 0) {
      data.map((item, index) => {
        return (
          <div className="user" key={index}>
            <Checkbox onChange={(e) => this.handleItemEle(e, item)} checked={item.checked}>
              <div className="user-list">
                <img src={require('images/one.jpg')} alt="user" className="user" />
                <div className="user-con">
                  <p className="desc">
                    <span className="name">
                      {item.userName} <i style={{display: item.userType == 1 ? 'inline-block' : 'none'}}>队长</i>
                    </span>
                    <span className="hb">
                      海拔：<i>{parseFloat(item.elevation).toFixed(2)}</i>
                    </span>
                  </p>
                  <p className="time">
                    最新定位时间:
                    <i>{util.formatDate(new Date(item.locTime), 'yyyy-MM-dd hh:mm:ss')} </i>
                  </p>
                </div>
              </div>
            </Checkbox>
          </div>
        );
      });
    }
  };
  getListTxt = (item) => {
    return (
      <div className="user-list" onClick={this.handleItemUser.bind(this, item)}>
        <img src={require('images/one.jpg')} alt="user" className="user" />
        <div className="user-con">
          <p className="desc">
            <span className="name">
              {item.userName} <i style={{display: item.userType == 1 ? 'inline-block' : 'none'}}>队长</i>
            </span>
            <span className="hb">
              海拔：<i>{parseFloat(item.elevation).toFixed(2)}</i>
            </span>
          </p>
          <p className="time">
            最新定位时间:
            <i>{util.formatDate(new Date(item.locTime), 'yyyy-MM-dd hh:mm:ss')} </i>
          </p>
        </div>
      </div>
    );
  };
  queryGroupUser = util.Debounce(
    (keyword) => {
      React.$ajax.common.queryGroupUser({keyword}).then((res) => {
        if (res.code == 0) {
          const resObj = res.data;
          const arr = [];
          for (const key in resObj) {
            if (resObj[key] && resObj[key].length > 0) {
              arr.push({
                name: key,
                children: resObj[key]
              });
            }
          }
          this.setState({userNameArr: arr});
        }
      });
    },
    300,
    false
  );
  handleChangeInput = (event) => {
    const val = event.target;
    console.log(val.value);
    this.queryGroupUser('');
  };
  async handleChangeNumber(e) {
    e.persist();
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
                  prefix={<Icon type="search" style={{color: '#BBBCBD'}} />}
                  onChange={(event) => this.handleChangeNumber(event).then(this.handleChangeInput)}
                  allowClear></Input>
              </div>

              <div className="all-checkout">
                <div>
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}>
                    显示轨迹(默认全部)
                  </Checkbox>
                </div>
                <div className="check-list">
                  {this.state.allAreaUser && this.state.allAreaUser.length
                    ? this.state.allAreaUser.map((item, index) => {
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
                                      海拔：<i>{parseFloat(item.elevation).toFixed(2)}</i>
                                    </span>
                                  </p>
                                  <p className="time">
                                    最新定位时间:
                                    <i>{util.formatDate(new Date(item.locTime), 'yyyy-MM-dd hh:mm:ss')} </i>
                                  </p>
                                </div>
                              </div>
                            </Checkbox>
                          </div>
                        );
                      })
                    : null}
                </div>
                {/* <CheckboxGroup
                  options={this.state.plainOptions}
                  value={this.state.checkedList}
                  onChange={this.onChange}
                /> */}
              </div>
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(GridMap);
