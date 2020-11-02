import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { WeekPicker } = DatePicker;
require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: [],
      weekDate: '',
    };
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ weekDate: '' });
    localStorage.setItem('ChangeWeek', '');
    localStorage.setItem('getScheduleOption', '');
  };
  ChangeWeek = (date, dateString) => {
    this.setState({ weekDate: dateString });
    localStorage.setItem('ChangeWeek', dateString);
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { weekDate } = this.state;
    this.props.handleSearch(weekDate);
  };
  render() {
    let expand = this.state.expand;
    const { getFieldDecorator } = this.props.form;
    const dateFormat = 'YYYY/MM/DD';
    const { defaultDate } = this.props.searchWeek;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="周期查询" {...thirdLayout}>
              {getFieldDecorator('weekDate', {
                //initialValue:moment(new Date(defaultDate), dateFormat)
              })(<WeekPicker onChange={this.ChangeWeek} placeholder="请输入查询周期" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset.bind(this)}>
              清空
            </Button>
            {/*<a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '展开' : '收起'}  <Icon type={this.state.expand ? 'down': 'up' } />
            </a>*/}
          </Col>
        </Row>
      </Form>
    );
  }
}

const ScheduleManageSearch = Form.create()(SearchForm);

export default ScheduleManageSearch;

// WEBPACK FOOTER //
// ./src/components/admin/searchForm/ScheduleManage/ScheduleManageSearch.js
