import React, { Component } from 'react';
import { Table, Button, Tag, Badge, Icon } from 'antd';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import VideoModal from 'pages/drill/VideoModal';
import LocateModal from 'pages/drill/LocateModal';
import httpAjax from 'libs/httpAjax';

const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');

class DeployTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
      },
      pageSize: 10,
      currPage: 1,
      changeLeft: false,
      locateFlag: false,
      data: [],
      loading: false,
    };
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if (Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return;
    }
    let filter = nextProps.filter;
    let isReset = util.method.isObjectValueEqual(nextProps, this.props);
    if (!isReset) {
      let _this = this;
      this.setState({ filter }, function () {
        _this.fetch({
          pageSize: _this.state.pageSize,
          currPage: 1,
          ...filter,
        });
      });
    }
  }
  handleTableChange = (pagination, filters, sorter) => {
    filters = this.props.filter;
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...filters,
    });
  };
  fetch(params = { pageSize: this.state.pageSize, currPage: this.state.currPage }) {
    this.setState({ loading: true });
    httpAjax('post', config.apiUrl + '/api/dailyTrainRecord/list', { ...params })
      .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        this.setState({ data: res.list, loading: false, pagination });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //视频
  addVideo = () => {
    this.setState({ changeLeft: true });
  };
  handleCancel = (e) => {
    this.setState({
      changeLeft: false,
    });
  };
  addLocate = () => {
    this.setState({ locateFlag: true });
  };
  handleClose = (e) => {
    this.setState({
      locateFlag: false,
    });
  };
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        /* render:id=>{
        return <Badge overflowCount={10000} count={id} style={{minWidth: '50px',fontSize:'12px',height:'16px',lineHeight:'16px', backgroundColor: '#99a9bf' }} /> 
      }*/
      },
      {
        title: '犬只',
        dataIndex: 'dogName',
        key: 'dogName',
      },
      {
        title: '训导员',
        dataIndex: 'trainerName',
        key: 'trainerName',
      },
      {
        title: '训练项目',
        dataIndex: 'subjectName',
        key: 'subjectName',
      },
      {
        title: '训练场地',
        dataIndex: 'trainPlace',
        key: 'trainPlace',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
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
        title: '训练状态',
        dataIndex: 'trainState',
        key: 'trainState',
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
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text) => {
          return (
            <div>
              <span style={{ cursor: 'pointer', color: '#1890ff' }}>
                <Icon type="video-camera" style={{ margin: '0 10px' }} />
                视频
              </span>
              {/*   <span  style={{cursor: "pointer",color:'#1890ff'}} onClick={()=>this.addLocate()} ><Icon type='flag' style={{margin:'0 10px', }} />定位</span>*/}
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <div className="table-operations"></div>
        <Table
          rowKey="id"
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          bordered
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
        {this.state.changeLeft ? <VideoModal changeLeft={this.state.changeLeft} onCancel={this.handleCancel} /> : null}
        {this.state.locateFlag ? <LocateModal changeLeft={this.state.locateFlag} onCancel={this.handleClose} /> : null}
      </div>
    );
  }
}
export default DeployTable;

// WEBPACK FOOTER //
// ./src/components/view/tables/drill/PdogTable.js
