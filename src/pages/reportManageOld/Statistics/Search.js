import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    const taskTypes = [
      { typeId: 1, typeName: '训练' },
      { typeId: 2, typeName: '巡逻' },
      { typeId: 3, typeName: '紧急调配' },
      { typeId: 4, typeName: '网格搜捕' },
      { typeId: 5, typeName: '定点集合' },
      { typeId: 6, typeName: '外勤任务' },
    ];
    this.state = {
      expand: true,
      value: '',
      years: [],
      peoples: [],
      taskTypes,
    };
  }
  componentWillMount() {
    this.searchPeople();
  }
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    let timeData = 'range-time-picker';
    this.props.form.validateFields((err, values) => {
      if (values[timeData]) {
        values.leaveStartTime = values[timeData][0].format('x');
        values.leaveEndTime = values[timeData][1].format('x');
      }
      console.log(values, 'values');
      limit(values);
    });
  };

  searchPeople = (name = '') => {
    httpAjax('post', config.apiUrl + '/api/userCenter/getTrainer', { name }).then((res) => {
      if (res.code == 0) {
        this.setState({ peoples: res.data });
      }
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
  handlePanelChange(date, dateString) {
    this.setState({
      value: data,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { expand, taskTypes, peoples, years } = this.state;
    const taskOption =
      taskTypes &&
      taskTypes.map((item, index) => {
        return (
          <Option value={item.typeId} key={index}>
            {item.typeName}
          </Option>
        );
      });
    const rangeConfig = {
      rules: [{ type: 'array', message: '请选择时间!' }],
    };
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <FormItem label="任务类型" {...thirdLayout}>
              {getFieldDecorator('typeId')(<Select placeholder="任务类型">{taskOption}</Select>)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="上报人员" {...thirdLayout}>
              {getFieldDecorator('userId')(
                <Select
                  placeholder="上报人员"
                  optionLabelProp="children"
                  showSearch
                  autosize={{ minRows: 2, maxRows: 24 }}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {peoples.map((item) => (
                    <Option value={item.id + ''} key={item.id + '_peo'}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="时间范围" {...thirdLayout}>
              {getFieldDecorator(
                'range-time-picker',
                rangeConfig
              )(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
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

const Search = Form.create()(SearchForm);
export default Search;
