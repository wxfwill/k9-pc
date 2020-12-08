import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    date: '',
    dogName: '',
  };
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    const { date, dogName } = this.state;
    this.props.form.validateFields((err, values) => {
      limit({ qryDate: values.date && values.date.format('YYYY-MM-DD'), dogName });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      date: '',
      dogName: '',
    });
  };

  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', message: 'Please select time!' }],
    };

    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <FormItem label="时间" {...thirdLayout}>
              {getFieldDecorator('date', {
                //initialValue:moment(new Date(defaultDate), dateFormat)
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD"
                  style={{ width: '220px' }}
                  onOk={(date) => {
                    this.setState({ date });
                  }}
                />
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <FormItem label="犬只" {...thirdLayout}>
              <Input
                placeholder="请输入犬名"
                value={this.state.dogName}
                onChange={(e) => {
                  this.setState({ dogName: e.target.value });
                }}
              />
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
          </Col>
        </Row>
      </Form>
    );
  }
}

const PrevSearch = Form.create()(SearchForm);

export default PrevSearch;

// WEBPACK FOOTER //
// ./src/components/view/searchForm/dog/HealthSearch.js
