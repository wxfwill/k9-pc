import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select, DatePicker} from 'antd';
import {thirdLayout} from 'util/Layout';
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
      years: [],
      peoples: [],
      holidayTypes: []
    };
  }
  componentWillMount() {
    this.searchPeople();

    //获取假期类型
    React.$ajax.postData('/api/leaveRecord/getLeaveTypeList', {}).then((res) => {
      if (res.code == 0) {
        const currentYear = Number(moment(new Date()).format('YYYY'));
        const {years} = this.state;
        for (let i = 0; i <= 100; i++) {
          years.push({id: currentYear + i, name: currentYear + i + '年'});
        }
        for (let i = 0; i <= 50; i++) {
          if (i > 0) {
            years.unshift({id: currentYear - i, name: currentYear - i + '年'});
          }
        }
        this.setState({holidayTypes: res.data, years: years});
        sessionStorage.setItem('holidayTypes', JSON.stringify(res.data));
      }
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    const {limit} = this.props;
    const timeData = 'range-time-picker';
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
    React.$ajax.postData('/api/userCenter/getTrainer', {name}).then((res) => {
      if (res.code == 0) {
        this.setState({peoples: res.data});
      }
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
  handlePanelChange(date, dateString) {
    this.setState({
      value: data
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {expand, holidayTypes, peoples, years} = this.state;
    const holidayTypesOption =
      holidayTypes &&
      holidayTypes.map((item, index) => {
        return (
          <Option value={item.typeId} key={index}>
            {item.typeName}
          </Option>
        );
      });
    const rangeConfig = {
      rules: [{type: 'array', message: '请选择时间!'}]
    };
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <FormItem label="假期类型" {...thirdLayout}>
              {getFieldDecorator('typeId')(<Select placeholder="假期类型">{holidayTypesOption}</Select>)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="请假人员" {...thirdLayout}>
              {getFieldDecorator('userId')(
                <Select
                  placeholder="请假人员"
                  optionLabelProp="children"
                  showSearch
                  autosize={{minRows: 2, maxRows: 24}}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
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

const Search = Form.create()(SearchForm);
export default Search;
