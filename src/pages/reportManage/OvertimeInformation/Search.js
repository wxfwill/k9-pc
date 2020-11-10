import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Radio, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import moment from 'moment';
import httpAjax from 'libs/httpAjax';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      dutyList: [],
      typeData: [
        {
          id: 1,
          name: '加班',
        },
        {
          id: 2,
          name: '夜班执勤',
        },
      ],
      feedbalVal: null,
    };
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      this.props.handleSearchData && this.props.handleSearchData(values);
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  selectHouseId = () => {};
  onChangeStartTime = () => {};
  onChangeEndTime = () => {};
  selectTaskType = () => {};
  hangdleFeedback = () => {};
  handlePrif = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="类型:" {...thirdLayout}>
              {getFieldDecorator('typeId')(
                <Select placeholder="请选择" allowClear onChange={this.selectHouseId}>
                  {this.state.typeData.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="姓名:" {...thirdLayout}>
              {getFieldDecorator('userName', {
                initialValue: '',
              })(<Input placeholder="请输入" allowClear />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="开始时间" {...thirdLayout}>
              {getFieldDecorator('repDateStart', {
                initialValue: null,
              })(<DatePicker placeholder="请输入" onChange={this.onChangeStartTime} />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="结束时间" {...thirdLayout}>
              {getFieldDecorator('repDateEnd', {
                initialValue: null,
              })(<DatePicker placeholder="请输入" onChange={this.onChangeEndTime} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xl={6} lg={6} md={8} sm={12} xs={12} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              清空
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handlePrif}>
              导出
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const InfoSearch = Form.create()(SearchForm);
export default InfoSearch;
