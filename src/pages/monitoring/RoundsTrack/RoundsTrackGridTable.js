import React, { Component } from 'react';
import { Table, Button, Tag, Badge, Form, Row, Col, Input, Icon, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { thirdLayout } from 'util/Layout';
import { firstLayout, secondLayout } from 'util/Layout';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import * as systomStatus from 'actions/systomStatus';
import { userInfo } from 'os';
const localSVG = require('images/banglocation.svg');
const visibleHeight = document.body.offsetHeight;

const FormItem = Form.Item;
var getRandomColor = function () {
  return '#' + ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).slice(-6);
};
var __sto = setInterval;
window.setInterval = function (callback, timeout, param) {
  var args = Array.prototype.slice.call(arguments, 2);
  var _cb = function () {
    callback.apply(null, args);
  };
  return __sto(_cb, timeout);
};

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    var _t = this.props.taskID;
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 5,
      currPage: 1,
      data: [],
      type: '',
      loading: false,
      filter: null,
      taskID: _t,
      timers: [],
      trochoiInfos: [],
    };
  }

  componentDidMount() {
    if (this.props.type == 'duty') {
      this.fetchTaskInfo(this.state.taskID);
    } else {
      this.fetch();
    }
  }

  componentWillReceiveProps(nextProps) {
    const socketMsg = nextProps.socketMsg;
    let { taskID, data } = this.state;
    let { type } = this.props;
    //信息类型2：紧急调配 3：日常巡逻
    let taskType = 3;
    if (type == 'duty') {
      taskType = 2;
    }
    if (
      socketMsg &&
      socketMsg.msgType == 'taskStatus' &&
      socketMsg.data.id == taskID &&
      taskType == socketMsg.data.type
    ) {
      data.map((item, index) => {
        socketMsg.data.detailIds.map((id, i) => {
          if (item.taskDetailId == id) {
            item.status = socketMsg.data.status;
          }
        });
      });
      this.setState({
        data,
      });
    }
  }

  fetchTaskInfo(params) {
    var me = this;
    this.setState({ loading: true });
    React.$ajax.postData('/api/dailyPatrols/getDailyPatrolsById', { id: params })
      .then((res) => {
        me._taskInfo = res.data;
        this.setState({
          ...res.data,
        });
        this.fetch();
      })
      .catch(function (error) {
        me.setState({ loading: false });
      });
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
    me.setState({ loading: true });

    React.$ajax.postData('/api/cmdMonitor/showAppTrochoidHis', { ...params, ...this.state.filter })
      .then((res) => {
        me.setState({ loading: false });
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
          let { timers, data, trochoiInfos } = me.state;
          me.state.data.map((item, index) => {
            if (item.taskDetailId == params.taskDetailId) {
              let trochoiInfo = {
                color: data[index].color,
                taskType: data[index].taskType,
                taskDetailId: data[index].taskDetailId,
                lastPointTime: '',
              };
              trochoiInfos.push(trochoiInfo);
              timers.push({
                timerId: setInterval(me.getNowTrochoid, 5000, trochoiInfo),
                taskDetailId: data[index].taskDetailId,
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
    React.$ajax.postData('/api/cmdMonitor/showAppTrochoid', {
      lastPointTime: trochoiInfo.lastPointTime,
      taskType: trochoiInfo ? trochoiInfo.taskType : '',
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

  handonRowClick = (userTask) => {
    var params = {
      pageSize: 600,
      currPage: 1,
      traceId: userTask.traceId,
      equipmentId: userTask.deviceId,
      taskDetailId: userTask.taskDetailId,
      taskType: userTask.taskType,
      rid: Math.random(),
      color: userTask.color,
    };
    let { taskStatus } = this.props;
    //任务未开始不执行轨迹数据请求
    if (taskStatus != 0) {
      this.fetchTrochoid(params);
    }
  };

  handleReset = () => {
    this.setState({
      queryTime: '',
    });
    this.props.form.resetFields();
  };

  fetch(params, dateString) {
    var me = this;
    let url = '/api/cmdMonitor/getUserByTaskId';
    if (this.props.type == 'duty') {
      url = '/api/dailyPatrols/getUserByTaskId';
    }
    if (params) {
      params = { pageSize: this.state.pageSize, currPage: this.state.currPage, taskId: this.state.taskID };
    } else {
      params = { pageSize: this.state.pageSize, currPage: this.state.currPage, taskId: this.state.taskID };
    }
    this.setState({ loading: true });
    React.$ajax.postData(url, { ...params, ...this.state.filter })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = parseInt(res.pageSize) * parseInt(res.totalPage);
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        res.data.map((item) => {
          item.color = getRandomColor();
        });
        this.setState({ data: res.data, loading: false, pagination });
      })
      .catch(function (error) {
        me.setState({ loading: false });
      });
  }

  render() {
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
        dataIndex: 'userNumber',
        key: 'userNumber',
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
        width: '15%',
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
        width: '15%',
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
      {
        title: '视频',
        dataIndex: 'video',
        key: 'video',
        width: '5%',
        render: (state, record) => {
          return this.props.type == 'duty' ? (
            <span
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={(e) => this.props.showVideo(e, record.taskDetailId)}
            >
              <Icon type="video-camera" style={{ margin: '0 10px' }} />
            </span>
          ) : (
            '--'
          );
        },
      },
    ];

    const { getFieldDecorator } = this.props.form;
    const { startTime, endTime } = this.state;
    const disabledDate = function (current) {
      return (current && current < moment(startTime)) || (current && current > moment(endTime));
    };
    return (
      <div>
        {/*this.props.type =='duty' ?   <Form
     
        onSubmit={this.handleSearch}
      >
        <Row gutter={24}>
          <Col >
              <FormItem  {...thirdLayout}>
                {getFieldDecorator('queryTime', {
                  rules:[{required:true,message:'请选择查询日期'}],
                  initialValue:moment(startTime) || ''
                })(
                  <DatePicker disabledDate={disabledDate}   format="YYYY-MM-DD" onChange={ (date,dataString) => this.fetch(date,dataString)}    />
                )}
              </FormItem>
            </Col>
        </Row>
      </Form> : null*/}
        <Table
          style={{ maxHeight: visibleHeight - 250, overflowY: 'scroll' }}
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          onChange={this.handleTableChange}
          onRowClick={this.handonRowClick}
          size="small"
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
const RoundsTrackGridTable = Form.create()(SearchForm);
export default connect(mapStateToProps, mapDispatchToProps)(RoundsTrackGridTable);

// WEBPACK FOOTER //
// ./src/components/view/monitoring/RoundsTrack/RoundsTrackGridTable.js
