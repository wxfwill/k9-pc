import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select, DatePicker} from 'antd';
import {thirdLayout} from 'util/Layout';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    expand: true,
    dogName: '',
    veterinaryName: '',
    treatmentResults: ''
  };
  handleSearch = (e) => {
    e.preventDefault();
    const {limit} = this.props;
    const timeData = 'range-time-picker';
    this.props.form.validateFields((err, fieldsValue) => {
      const rangeTimeValue = fieldsValue['range-time-picker'];
      let rangeValueArr = ['', ''];
      if (!(typeof rangeTimeValue === 'undefined' || rangeTimeValue.length == 0)) {
        rangeValueArr = [rangeTimeValue[0].format('YYYY-MM-DD'), rangeTimeValue[1].format('YYYY-MM-DD')];
      }
      const values = {
        ...fieldsValue,
        'range-time-picker': rangeValueArr
      };
      const subData = {
        startTime: values[timeData][0],
        endTime: values[timeData][1],
        dogName: values.dogName,
        veterinaryName: values.veterinaryName,
        treatmentResults: values.treatmentResults == null ? '' : parseInt(values.treatmentResults)
      };
      Object.keys(subData).forEach(function (item, index) {
        typeof subData[item] === 'undefined' ? (subData[item] = '') : '';
      });
      limit(subData);
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
    const rangeConfig = {
      rules: [{type: 'array', message: 'Please select time!'}]
    };
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label={'犬名'} {...thirdLayout}>
              {getFieldDecorator('dogName')(<Input placeholder="犬名或ID" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label={'兽医'} {...thirdLayout}>
              {getFieldDecorator('veterinaryName')(<Input placeholder="兽医或兽医ID" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label={'治疗结果'} {...thirdLayout}>
              {getFieldDecorator('treatmentResults')(
                <Select placeholder="治疗结果">
                  <Option value="">全部</Option>
                  <Option value="1">痊愈</Option>
                  <Option value="2">未痊愈</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{display: expand ? 'none' : 'block'}}>
            <FormItem label="发病日期" {...thirdLayout}>
              {getFieldDecorator(
                'range-time-picker',
                rangeConfig
              )(<RangePicker format="YYYY-MM-DD" style={{width: '220px'}} />)}
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
            <a style={{marginLeft: 8, fontSize: 12}} onClick={this.toggle}>
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
// ./src/components/admin/searchForm/DogManage/DogCureSearch.js
