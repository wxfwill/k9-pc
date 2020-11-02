import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
import moment from 'moment';
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      peoples: [],
    };
  }
  componentWillMount() {
    //人员信息
    httpAjax('post', config.apiUrl + '/api/userCenter/getTrainer', { name }).then((res) => {
      if (res.code == 0) {
        this.setState({ peoples: res.data });
      }
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    let timeData = 'range-time-picker';
    this.props.form.validateFields((err, values) => {
      if (values.recordTime) {
        values.recordTime = moment(values.recordTime).format('x');
      }
      limit(values);
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };
  handleChange(name, value) {
    this.setState({
      [name]: name == 'recordTime' ? moment(value).format('x') : value,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { expand, peoples } = this.state;
    const peoplesOption =
      peoples &&
      peoples.map((item, index) => {
        return (
          <Option value={item.id} key={index}>
            {item.name}
          </Option>
        );
      });
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="记录时间" {...thirdLayout}>
              {getFieldDecorator('recordTime')(<DatePicker />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="类型" {...thirdLayout}>
              {getFieldDecorator('type')(
                <Select placeholder="请选择类型">
                  <Option value={''}>请选择类别</Option>
                  <Option value={1}>刑事案件</Option>
                  <Option value={2}>搜爆安检</Option>
                  <Option value={3}>日常事务</Option>
                  <Option value={4}>会议</Option>
                  <Option value={5}>领导交办</Option>
                  <Option value={6}>日常诊疗</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="汇报人" {...thirdLayout}>
              {getFieldDecorator('reportUserId')(
                <Select
                  placeholder="请选择汇报人"
                  optionLabelProp="children"
                  showSearch
                  autosize={{ minRows: 2, maxRows: 24 }}
                  // onChange={(a,b,c) => {console.log(a,b,c)}}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {peoples.map((item) => (
                    <Option value={item.id + ''} key={item.id + '_peo'}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              清空
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const CommandSearch = Form.create()(SearchForm);
export default CommandSearch;

// WEBPACK FOOTER //
// ./src/components/admin/reportManage/Command/Com/Search.js
