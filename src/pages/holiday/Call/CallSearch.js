import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select, DatePicker} from 'antd';
import {thirdLayout} from 'util/Layout';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    expand: true,
    qryDateStr: ''
  };
  handleSearch = (e) => {
    e.preventDefault();
    const {limit} = this.props;
    const timeData = 'qryDateStr';
    this.props.form.validateFields((err, fieldsValue) => {
      Object.keys(fieldsValue).forEach(function (item, index) {
        typeof fieldsValue[item] === 'undefined' ? (fieldsValue[item] = '') : '';
      });
      if (fieldsValue.qryDateStr != '') {
        fieldsValue.qryDateStr = fieldsValue.qryDateStr.format('YYYY-MM-DD');
      }
      limit(fieldsValue);
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  toggle = () => {
    const {expand} = this.state;
    this.setState({expand: !expand});
  };
  render() {
    const expand = this.state.expand;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <FormItem label="提交时间" {...thirdLayout}>
              {getFieldDecorator('qryDateStr')(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width: '220px'}} />
              )}
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

const CallSearch = Form.create()(SearchForm);

export default CallSearch;

// WEBPACK FOOTER //
// ./src/components/admin/holiday/Call/CallSearch.js
