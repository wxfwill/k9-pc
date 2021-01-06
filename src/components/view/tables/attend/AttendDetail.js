import React, {Component} from 'react';
import {Collapse, Icon, Tag, Row, Col, Table, Card, Button} from 'antd';
import {Link} from 'react-router-dom';
import classnames from 'classnames';
import moment from 'moment';
const Panel = Collapse.Panel;
require('style/view/common/deployTable.less');
class AttendDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1
      },
      pageSize: 5,
      currPage: 1,
      data: [],
      filter: null,
      loading: false,
      queryId: '',
      changeLeft: false,
      showDetail: false,
      statisticsTime: ''
    };
  }
  componentWillMount() {
    const {userId, statisticsTime} = this.props;
    this.fetch({pageSize: this.state.pageSize, currPage: this.state.currPage, userId, statisticsTime});
  }
  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    const {userId, statisticsTime} = this.props;
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      userId,
      statisticsTime,
      ...this.state.filter
    });
  };
  fetch(params = {pageSize: this.state.pageSize, currPage: this.state.currPage}) {
    this.setState({loading: true});
    React.$ajax
      .postData('/api/leaveRecord/attendanceStatisticsInfo', {...params})
      .then((res) => {
        const pagination = {...this.state.pagination};
        pagination.total = res.totalCount;
        pagination.current = res.currPage;
        pagination.pageSize = res.pageSize;
        res.list.forEach((item, index) => {
          item.leaveEndTime = moment(item.leaveEndTime).format('YYYY-MM-DD');
          item.leaveStartTime = moment(item.leaveStartTime).format('YYYY-MM-DD');
          item.applyTime = moment(item.applyTime).format('YYYY-MM-DD');
        });
        this.setState({data: res.list, loading: false, pagination});
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleShow() {
    this.props.handleShow();
  }
  getColumns() {
    const _this = this;
    const columns = [
      {
        title: '请假单号',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '警号',
        dataIndex: 'number',
        key: 'number'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '请假类型',
        dataIndex: 'typeStr',
        key: 'typeStr'
      },
      {
        title: '开始时间',
        dataIndex: 'leaveStartTime',
        key: 'leaveStartTime',
        render: (text, record, index) => {
          return (
            <span>{record.leaveStartTime ? moment(record.leaveStartTime).format('YYYY-MM-DD h:mm:ss') : '--'}</span>
          );
        }
      },
      {
        title: '结束时间',
        dataIndex: 'leaveEndTime',
        key: 'leaveEndTime',
        render: (text, record, index) => {
          return <span>{record.leaveEndTime ? moment(record.leaveEndTime).format('YYYY-MM-DD h:mm:ss') : '--'}</span>;
        }
      },
      {
        title: '申请时长（天）',
        dataIndex: 'duration',
        key: 'duration'
      },
      {
        title: '提交日期',
        dataIndex: 'applyTime',
        key: 'applyTime',
        render: (text, record, index) => {
          return <span>{record.applyTime ? moment(record.applyTime).format('YYYY-MM-DD h:mm:ss') : '--'}</span>;
        }
      },
      {
        title: '审批状态',
        dataIndex: 'stateStr',
        key: 'stateStr'
        /* render:(text,record,index)=>{
          let spanText='';
          switch (record.status) {
            case 0:
              spanText='待审批';
              break;
            case 1:
              spanText='驳回';
              break;
            case 2:
              spanText='待销假';
              break;
            default:
             spanText='销假完成';
              break;
          }
          return <span>{spanText}</span>
        }*/
      }
    ];
    return columns;
  }
  render() {
    const {changeLeft, caption} = this.props;
    return (
      <div className={classnames('off-detail')} style={{left: changeLeft ? '360px' : '100%'}}>
        <div className="detail-table">
          <Card title={this.state.title}>
            <Collapse defaultActiveKey={['1', '2']}>
              <Panel showArrow={false} key="1">
                <Table
                  loading={this.state.loading}
                  columns={this.getColumns()}
                  dataSource={this.state.data}
                  bordered
                  pagination={this.state.pagination}
                  onChange={this.handleTableChange}
                />
              </Panel>
            </Collapse>
          </Card>
        </div>
        <span className="cursor p-icon" onClick={this.handleShow.bind(this)}>
          <Icon type="right" />
        </span>
      </div>
    );
  }
}
export default AttendDetail;

// WEBPACK FOOTER //
// ./src/components/view/tables/attend/AttendDetail.js
