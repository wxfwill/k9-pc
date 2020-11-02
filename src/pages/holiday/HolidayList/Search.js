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
    this.state = {
      expand: true,
      value: '',
      dutyList: [],
      years: [],
      peoples: [],
      holidayTypes: [],
    };
  }
  componentWillMount() {
    this.searchPeople();
    //获取职务信息
    httpAjax('post', config.apiUrl + '/api/basicData/dutyList', {}).then((res) => {
      if (res.code == 0) {
        this.setState({ dutyList: res.data });
        sessionStorage.setItem('dutyList', JSON.stringify(res.data));
      }
    });
    //获取假期类型
    httpAjax('post', config.apiUrl + '/api/leaveRecord/getLeaveTypeList', {}).then((res) => {
      if (res.code == 0) {
        let currentYear = Number(moment(new Date()).format('YYYY'));
        let { years } = this.state;
        for (let i = 0; i <= 100; i++) {
          years.push({ id: currentYear + i, name: currentYear + i + '年' });
        }
        for (let i = 0; i <= 50; i++) {
          if (i > 0) {
            years.unshift({ id: currentYear - i, name: currentYear - i + '年' });
          }
        }
        this.setState({ holidayTypes: res.data, years: years });
        sessionStorage.setItem('holidayTypes', JSON.stringify(res.data));
      }
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    let timeData = 'range-time-picker';
    this.props.form.validateFields((err, values) => {
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
    let { expand, dutyList, holidayTypes, peoples, years } = this.state;
    const dutyListOption =
      dutyList &&
      dutyList.map((item, index) => {
        return (
          <Option value={item.id} key={index}>
            {item.name}
          </Option>
        );
      });
    const holidayTypesOption =
      holidayTypes &&
      holidayTypes.map((item, index) => {
        return (
          <Option value={item.typeId} key={index}>
            {item.typeName}
          </Option>
        );
      });
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="警员" {...thirdLayout}>
              {getFieldDecorator('userId')(
                <Select
                  placeholder="警员"
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
            <FormItem label="职务" {...thirdLayout}>
              {getFieldDecorator('duty')(<Select placeholder="职务">{dutyListOption}</Select>)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="选择年份" {...thirdLayout}>
              {getFieldDecorator('leaveYear')(
                <Select
                  placeholder="选择年份"
                  optionLabelProp="children"
                  showSearch
                  autosize={{ minRows: 2, maxRows: 24 }}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {years.map((item) => (
                    <Option value={item.id + ''} key={item.id + '_peo'}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ display: expand ? 'none' : 'block' }}>
            <FormItem label="假期类型" {...thirdLayout}>
              {getFieldDecorator('typeId')(<Select placeholder="假期类型">{holidayTypesOption}</Select>)}
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
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '展开' : '收起'} <Icon type={this.state.expand ? 'down' : 'up'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const Search = Form.create()(SearchForm);
export default Search;
