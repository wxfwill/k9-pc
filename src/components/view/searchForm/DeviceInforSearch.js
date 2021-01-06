import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select} from 'antd';
import {thirdLayout} from 'util/Layout';
import httpAjax from 'libs/httpAjax';
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }
  handleSearch = (e) => {
    e.preventDefault();
    const {limit} = this.props;
    this.props.form.validateFields((err, values) => {
      Object.keys(values).forEach(function (item, index) {
        typeof values[item] === 'undefined' ? (values[item] = '') : '';
      });
      limit(values);
    });
    //this.props.handleSearch();
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="设备查询" {...thirdLayout}>
              {getFieldDecorator('itemsName')(<Input placeholder="设备查询" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>
              清空
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const DeviceInforSearch = Form.create()(SearchForm);

export default DeviceInforSearch;

// WEBPACK FOOTER //
// ./src/components/view/searchForm/DeviceInforSearch.js
