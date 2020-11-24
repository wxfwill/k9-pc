import React, { Component } from 'react';
import { Form, Select, Col, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
const FormItem = Form.Item;
const Option = Select.Option;
class GlobalTaskType extends Component {
  constructor(props) {
    super(props);
    this.state = { taskType: [] };
  }
  componentDidMount() {}
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    return (
      <React.Fragment>
        <Col xl={6} lg={6} md={8} sm={12} xs={12}>
          <FormItem label="开始时间" {...thirdLayout}>
            {getFieldDecorator('startDate', {
              initialValue: null,
            })(<DatePicker placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12} xs={12}>
          <FormItem label="结束时间" {...thirdLayout}>
            {getFieldDecorator('endDate', {
              initialValue: null,
            })(<DatePicker placeholder="请输入" />)}
          </FormItem>
        </Col>
      </React.Fragment>
    );
  }
}

export default GlobalTaskType;
