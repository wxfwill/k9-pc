import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';
import ScheduleManageSearch from 'components/admin/searchForm/ScheduleManage/ScheduleManageSearch';
import ScheduleManageTable from 'components/admin/tables/ScheduleManage/ScheduleManageTable';

class ScheduleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWeek: '',
      options: ''
    };
  }
  componentWillMount() {
    this.getScheduleData({});
    localStorage.setItem('ChangeWeek', '');
    localStorage.setItem('getScheduleOption', '');
  }
  getScheduleData = (data) => {
    React.$ajax.postData('/api/onDuty/getWeekDuty', data).then((res) => {
      this.setState({
        searchWeek: res.data,
        options: data
      });
    });
  };
  handleSearch = (dateString) => {
    if (dateString) {
      const ChangeWeek = dateString.replace(/周/, '');
      const options = {
        year: ChangeWeek.split('-')[0],
        week: ChangeWeek.split('-')[1]
      };
      this.getScheduleData(options);
      localStorage.setItem('getScheduleOption', JSON.stringify(options));
    } else {
      this.getScheduleData({});
    }
  };
  render() {
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <ScheduleManageSearch handleSearch={this.handleSearch} searchWeek={this.state.searchWeek} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              {this.state.searchWeek == '' ? null : (
                <ScheduleManageTable
                  filter={this.state.limit}
                  searchWeek={this.state.searchWeek}
                  getScheduleData={this.getScheduleData}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ScheduleManage;

// WEBPACK FOOTER //
// ./src/components/admin/scheduleManage/ScheduleManage.js
