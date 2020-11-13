import React, { Component } from 'react';
import { Table, Button, Tag, Badge } from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
const localSVG = require('images/banglocation.svg');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import * as systomStatus from 'actions/systomStatus';
const columns = [
  {
    title: '轨迹颜色',
    dataIndex: 'color',
    key: 'color',
    width: '10%',
    render: (color) => <Tag color={color} style={{ cursor: 'pointer', height: '12px', width: '12px' }}></Tag>,
  },
  {
    title: '警号',
    width: '15%',
    dataIndex: 'number',
    key: 'number',
    render: (text) => <span style={{ cursor: 'pointer' }}>{text}</span>,
  },
  {
    title: '姓名',
    width: '15%',
    dataIndex: 'userName',
    key: 'userName',
    render: (text) => <span style={{ cursor: 'pointer' }}>{text}</span>,
  },
  {
    title: '区域编号',
    dataIndex: 'areaNo',
    key: 'areaNo',
    width: '10%',
    render: (text) => <span style={{ cursor: 'pointer' }}>{text}</span>,
  },
  {
    title: '犬只',
    width: '15%',
    dataIndex: 'dogName',
    key: 'dogName',
    render: (text) => <span style={{ cursor: 'pointer' }}>{text}</span>,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: '10%',
    render: (text) => {
      if (text == '') {
        return '--';
      }
      let date = new Date(text);
      let YMD = date.toLocaleString().split(' ')[0];
      let HMS = date.toString().split(' ')[4];
      let startTime = YMD + ' ' + HMS;
      return startTime;
    },
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    width: '10%',
    render: (text) => {
      if (text == '') {
        return '--';
      }
      let date = new Date(text);
      let YMD = date.toLocaleString().split(' ')[0];
      let HMS = date.toString().split(' ')[4];
      let endTime = YMD + ' ' + HMS;
      return endTime;
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '5%',
    render: (state) => {
      if (state == 0) {
        return <Tag color="#2db7f5">未开始</Tag>;
      } else if (state == 1) {
        return <Tag color="#108ee9">执行中</Tag>;
      } else if (state >= 2) {
        return <Tag color="#87d068">已完成</Tag>;
      } else {
        return '--';
      }
    },
  },
];
var __sto = setInterval;
window.setInterval = function (callback, timeout, param) {
  var args = Array.prototype.slice.call(arguments, 2);
  var _cb = function () {
    callback.apply(null, args);
  };
  return __sto(_cb, timeout);
};
class GridTaskTrackGridTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [], //网格区域人员信息列表
      timers: [],
      trochoiInfos: [],
    };
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState({ users: nextProps.users });
    const socketMsg = nextProps.socketMsg;
    let { users } = this.state;
    let { taskID } = this.props;
    if (socketMsg && socketMsg.msgType == 'taskStatus' && socketMsg.data.id == taskID && socketMsg.data.type == 4) {
      users.map((item, index) => {
        socketMsg.data.detailIds.map((id, i) => {
          if (item.taskDetailId == id) {
            item.status = socketMsg.data.status;
          }
        });
      });
      this.setState({
        users,
      });
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
    });
  };

  fetchTrochoid = (params) => {
    var me = this;
    this.setState({ loading: true });

    httpAjax('post', config.apiUrl + '/api/cmdMonitor/showAppTrochoidHis', { ...params, ...this.state.filter })
      .then((res) => {
        this.setState({ loading: false });

        const pathsHis = res.data.pathsHis;
        pathsHis.forEach((item, index) => {
          if (index == pathsHis.length - 1) {
            this.props.drawTrace(item, 1, params.color);
          } else {
            this.props.drawTrace(item, params.currPage, params.color);
          }
        });
        //任务未结束设置定时器获取实时数据
        if (res.data.isEnd == 0) {
          debugger;
          let { timers, users, trochoiInfos } = me.state;
          users.map((item, index) => {
            if (item.id == params.taskDetailId) {
              let trochoiInfo = {
                color: users[index].color,
                taskDetailId: users[index].id,
                lastPointTime: '',
              };
              trochoiInfos.push(trochoiInfo);
              timers.push({
                timerId: setInterval(me.getNowTrochoid, 5000, trochoiInfo),
                taskDetailId: users[index].id,
              });
              me.setState({
                timers: timers,
              });
            }
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        me.setState({ loading: false });
      });
  };
  componentWillUnmount() {
    let { timers } = this.state;
    //清除所有定时器
    timers.map((item) => {
      clearInterval(item.timerId);
    });
  }
  //获取实时数据
  getNowTrochoid = (data) => {
    let trochoiInfo = data;
    let { trochoiInfos, timers } = this.state;
    trochoiInfos.map((item) => {
      if (item.taskDetailId == data.taskDetailId) {
        trochoiInfo = item;
      }
    });
    httpAjax('post', config.apiUrl + '/api/cmdMonitor/showAppTrochoid', {
      lastPointTime: trochoiInfo.lastPointTime,
      taskType: 3,
      taskDetailId: trochoiInfo ? trochoiInfo.taskDetailId : '',
    }).then((res) => {
      const pathsCurr = res.data.pathsCurr;
      if (pathsCurr && pathsCurr.length > 0) {
        trochoiInfos.map((item) => {
          if (item.taskDetailId == data.taskDetailId) {
            item.lastPointTime = res.data.lastPointTime;
          }
        });
        this.setState({
          trochoiInfos: trochoiInfos,
        });
        //任务已经结束
        if (res.data.isEnd == 1) {
          timers.map((item) => {
            if (item.taskDetailId == data.taskDetailId) {
              clearInterval(item.timerId);
            }
          });
        }
        pathsCurr.forEach((item) => {
          this.props.drawTrace(item, 0, trochoiInfo.color);
        });
      }
    });
  };

  handonRowClick = (user) => {
    const self = this;
    var params = {
      taskId: user.bigTaskId,
      // userId:user.userId,
      pageSize: 600,
      currPage: 1,
      rid: Math.random(),
      taskDetailId: user.taskDetailId,
      taskType: 3,
      color: user.color,
    };
    let { taskStatus } = this.props;
    //任务未开始不执行轨迹数据请求
    if (taskStatus != 0) {
      this.fetchTrochoid(params);
    }
  };

  setUserList(users) {
    //设置用户列表,用于查询用户的轨迹
    this.setState({ users: users });
  }

  render() {
    return (
      <div>
        <Table
          rowKey="key"
          style={{ maxHeight: '400px', overflowY: 'scroll' }}
          columns={columns}
          dataSource={this.state.users}
          onChange={this.handleTableChange}
          onRowClick={this.handonRowClick}
          size="small"
          pagination={false}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  socketMsg: state.system && state.system.socketMsg,
});
const mapDispatchToProps = (dispatch) => ({
  // sysActions: bindActionCreators(systomStatus, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(GridTaskTrackGridTable);

// WEBPACK FOOTER //
// ./src/components/view/monitoring/GridRaid/GridTaskTrackGridTable.js
