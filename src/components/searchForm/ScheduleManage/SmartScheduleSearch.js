import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
class SearchForm extends React.Component {
  state = {
    dateString: [],
  };
  dateChange = (value, dateString) => {
    this.setState({
      dateString: dateString,
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    this.props.handleSearch(this.state.dateString);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="日期" {...thirdLayout}>
              {getFieldDecorator('weekDate')(
                <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} onChange={this.dateChange} />
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <Button type="primary" htmlType="submit">
              生成
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const SmartScheduleSearch = Form.create()(SearchForm);
export default SmartScheduleSearch;
