import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    expand: true,
    dogName: '',
    veterinaryName: '',
    treatmentResults: '',
  };
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      Object.keys(fieldsValue).forEach(function (item, index) {
        typeof fieldsValue[item] == 'undefined' ? (fieldsValue[item] = '') : '';
      });
      if (fieldsValue.yearMonth != '') {
        fieldsValue.yearMonth = fieldsValue.yearMonth.format('YYYY-MM');
      }
      limit(fieldsValue);
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
      [name]: value,
    });
  }
  render() {
    let expand = this.state.expand;
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', message: 'Please select time!' }],
    };
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label={'审核状态'} {...thirdLayout}>
              {getFieldDecorator('status')(
                <Select placeholder="审核状态">
                  <Option value="">全部</Option>
                  <Option value={0}>未审核</Option>
                  <Option value={1}>通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label={'时间'} {...thirdLayout}>
              {getFieldDecorator('yearMonth')(<MonthPicker placeholder="选择时间" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="训导员" {...thirdLayout}>
              {getFieldDecorator('userName')(<Input placeholder="训导员" />)}
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
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '展开' : '收起'} <Icon type={this.state.expand ? 'down' : 'up'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const CureSearch = Form.create()(SearchForm);

export default CureSearch;

// WEBPACK FOOTER //
// ./src/components/view/searchForm/OfficerSearch.js
