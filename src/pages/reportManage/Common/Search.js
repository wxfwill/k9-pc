import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Radio, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

const { MonthPicker } = DatePicker;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      isopen: false,
      checkYear: false,
      checkMonth: false,
      teamData: [],
    };
  }
  componentDidMount() {
    let { isShowTeam, isShowName } = this.props;
    if (isShowTeam) {
      this.queryAllTeam();
    }
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ checkYear: false });
        this.props.handleSearchData && this.props.handleSearchData(values);
      }
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ checkYear: false });
    this.props.form.setFieldsValue({ year: null });
    this.props.handleReset && this.props.handleReset();
  };
  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  selectHouseId = () => {};
  onChangeMonth = (ev) => {
    if (ev && moment(ev).format('M') && !this.props.form.getFieldValue('year')) {
      this.setState({ checkYear: true });
    } else {
      this.setState({ checkYear: false });
    }
  };
  queryAllTeam = () => {
    React.httpAjax('post', config.apiUrl + '/api/userCenter/queryAllGroups').then((res) => {
      if (res.code == 0) {
        //  this.setState({ allHouseData: res.data });
        console.log('查询所有的中队信息');
        // console.log(res.data);
        let resObj = res.data;
        let newArr = [];
        for (let key in resObj) {
          let obj = { id: key, name: resObj[key] };
          newArr.push(obj);
        }
        this.setState({ teamData: newArr });
      }
    });
  };
  onChangeYear = (time) => {
    if (this.props.form.getFieldValue('month')) {
      this.setState({ checkYear: true }, () => {
        this.props.form.setFields({
          year: {
            value: null,
            error: [new Error('请选择年份12')],
          },
        });
      });
    } else {
      this.setState({ checkYear: false });
    }
  };
  selectTaskType = () => {};
  hangdleFeedback = () => {};
  hangdleCatch = () => {};
  handlePrif = () => {};
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { isopen, time } = this.state;
    let { isShowTeam, isShowName } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          {isShowTeam ? (
            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
              <FormItem label="中队:" {...thirdLayout}>
                {getFieldDecorator('groupId')(
                  <Select
                    placeholder="请选择"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    allowClear
                    onChange={this.selectHouseId}
                  >
                    {this.state.teamData.map((item) => {
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
          ) : null}

          {isShowName ? (
            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
              <FormItem label="姓名:" {...thirdLayout}>
                {getFieldDecorator('userId')(
                  <Select
                    placeholder="请选择"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    allowClear
                    onChange={this.selectHouseId}
                  >
                    {this.state.teamData.map((item) => {
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
          ) : null}
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="年份" {...thirdLayout}>
              {getFieldDecorator('year', {
                initialValue: time,
                rules: [
                  {
                    required: this.state.checkYear,
                    message: '请选择年份',
                  },
                ],
              })(
                <DatePicker
                  mode="year"
                  open={isopen}
                  getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                  format="YYYY"
                  onOpenChange={(status) => {
                    console.log('status');
                    console.log(status);
                    if (status) {
                      this.setState({ isopen: true });
                    } else {
                      this.setState({ isopen: false });
                    }
                  }}
                  onPanelChange={(v) => {
                    this.setState({
                      time: v,
                      isopen: false,
                    });
                    setFieldsValue({ year: v });
                  }}
                  onChange={this.onChangeYear}
                  placeholder="请选择"
                />
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="月份" {...thirdLayout}>
              {getFieldDecorator('month', {
                initialValue: null,
                rules: [
                  {
                    required: this.state.checkMonth,
                    message: '请选择月份',
                  },
                ],
              })(
                <MonthPicker
                  placeholder="请选择"
                  getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                  format="MM"
                  onChange={this.onChangeMonth}
                />
              )}
            </FormItem>
          </Col>

          <Col xl={6} lg={6} md={6} sm={12} xs={12} style={{ textAlign: 'center' }}>
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
