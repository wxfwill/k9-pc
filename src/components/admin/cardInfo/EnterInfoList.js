import React, {Component} from 'react';
import {Row, Col, Card, Button} from 'antd';
import moment from 'moment';
import SearchDom from './Search';
import ListDom from './List';
import httpAjax from 'libs/httpAjax';

require('style/view/common/conduct.less');

const columns = [
  {
    title: '车牌',
    dataIndex: 'pass_plate',
    render: (record) => record || '----'
  },
  {
    title: '通行证类型',
    dataIndex: 'passport_type_name',
    render: (record) => record || '----'
  },
  {
    title: '客户',
    dataIndex: 'client_name',
    render: (record) => record || '----'
  },
  {
    title: '入场车类型',
    dataIndex: 'enter_car_type_name',
    render: (record) => record || '----'
  },
  {
    title: '区域',
    dataIndex: 'area_name',
    render: (record) => record || '----'
  },
  {
    title: '入场通道',
    dataIndex: 'enter_channel_name',
    render: (record) => record || '----'
  },
  {
    title: '入场时间',
    dataIndex: 'enter_time',
    render: (record) => record || '----'
  }
];

class CarEnterListComponent extends Component {
  constructor(props) {
    super(props);
    this.pagination = {
      total: 1,
      current: 1,
      pageSize: 10
    };
    this.state = {
      dataSource: [],
      loading: false,
      pagination: this.pagination
    };
    this.dateArr = [];
    this.carNo = '';
  }
  handleSubmit = (params) => {
    const {carNo, dateTime} = params;
    dateTime ? (this.dateArr = dateTime) : '';
    this.carNo = carNo || '';
    const data = {
      pageSize: this.pagination.pageSize,
      currPage: this.pagination.current,
      carNo: this.carNo,
      passTimeBegin: dateTime[0].format('YYYY-MM-DD HH:mm:ss'),
      passTimeEnd: dateTime[1].format('YYYY-MM-DD HH:mm:ss')
    };
    this.requestList(data);
  };
  handleReset = (params) => {
    this.carNo = '';
    this.dateArr = params;
  };
  changePageSubmit = (params) => {
    const {pageSize, current} = params;
    const data = {
      pageSize: pageSize,
      currPage: current,
      carNo: this.carNo,
      passTimeBegin: this.dateArr[0].format('YYYY-MM-DD HH:mm:ss'),
      passTimeEnd: this.dateArr[1].format('YYYY-MM-DD HH:mm:ss')
    };
    this.requestList(data);
  };
  requestList(params, callBack) {
    this.setState({loading: true});
    httpAjax('post', config.apiUrl + '/api/hmInterface/queryEnterInfo', {...params})
      .then((res) => {
        const pagination = {...this.state.pagination};
        pagination.total = res.data.totalCount;
        pagination.current = res.data.currPage;
        this.setState({
          dataSource: res.data.list,
          loading: false,
          pagination
        });
        callBack && callBack(res);
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false
        });
      });
  }
  componentWillMount() {
    const nowTime = new Date().getTime();
    const today = moment();
    const twoDayAge = moment(nowTime - 24 * 60 * 60 * 1000 * 2);
    this.setState({
      defaultTime: [twoDayAge, today]
    });
  }
  componentDidMount() {
    const {defaultTime} = this.state;

    const data = {
      pageSize: this.pagination.pageSize,
      currPage: this.pagination.current,
      passTimeBegin: defaultTime[0].format('YYYY-MM-DD HH:mm:ss'),
      passTimeEnd: defaultTime[1].format('YYYY-MM-DD HH:mm:ss')
    };
    this.requestList(data, function (result) {});
  }
  render() {
    const {dataSource, pagination, loading, defaultTime} = this.state;
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <SearchDom goSubmit={this.handleSubmit} reSet={this.handleReset} defaultTime={defaultTime} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <ListDom
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                pageChange={this.changePageSubmit}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default CarEnterListComponent;

// WEBPACK FOOTER //
// ./src/components/admin/cardInfo/EnterInfoList.js
