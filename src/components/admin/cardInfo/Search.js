import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultTime: [],
    };

    this.dateArr = [];
  }
  componentWillMount() {
    const { defaultTime } = this.props;
    this.dateArr = defaultTime;
    this.setState({
      defaultTime,
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    let { goSubmit } = this.props;
    let timeData = 'range-time-picker';
    this.props.form.validateFields((err, values) => {
      goSubmit(values);
    });
  };
  handleReset = () => {
    this.props.form.resetFields();

    this.props.reSet && this.props.reSet(this.dateArr);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let { dateTime, defaultTime } = this.state;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="查询时间" {...thirdLayout}>
              {getFieldDecorator('dateTime', {
                rules: [{ required: true, message: '日期不能为空' }],
                initialValue: defaultTime,
              })(
                <RangePicker
                  allowClear={false}
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  onOk={this.onOk}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="车牌号	" {...thirdLayout}>
              {getFieldDecorator('carNo')(<Input placeholder="车牌号	" />)}
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

const UserSearch = Form.create()(SearchForm);
export default UserSearch;
