import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select} from 'antd';
import {thirdLayout} from 'util/Layout';
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    expand: true,
    taskValue: '',
    areaValue: '',
    monthValue: ''
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      this.props.limit({location: values.location});
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  toggle = () => {
    const {expand} = this.state;
    this.setState({expand: !expand});
  };
  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  }
  render() {
    const expand = this.state.expand;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label={'所属区域'} {...thirdLayout}>
              {getFieldDecorator('location')(<Input placeholder="请输入" />)}
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

const DeploySearch = Form.create()(SearchForm);

export default DeploySearch;

// WEBPACK FOOTER //
// ./src/components/view/searchForm/DeploySearch.js
