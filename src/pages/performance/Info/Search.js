import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      value: '',
      years: [],
      peoples: [],
      checkDate: moment(new Date(), 'YYYY-MM'),
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
      console.log(values, 'values');
      values.checkDate = moment(values.checkDate).format('YYYY-MM');
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
    let { expand, peoples, years, checkDate } = this.state;

    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="姓名" {...thirdLayout}>
              {getFieldDecorator('userId')(
                <Select
                  placeholder="姓名"
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
            <FormItem label="选择月份	" {...thirdLayout}>
              {getFieldDecorator('checkDate', {
                initialValue: checkDate,
              })(<MonthPicker placeholder="选择月份" initialValue={checkDate} />)}
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
