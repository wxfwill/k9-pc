import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Radio, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
const FormItem = Form.Item;
const Option = Select.Option;

const { MonthPicker } = DatePicker;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      isopen: false,
      teamData: [
        { id: 1, name: '一中队' },
        { id: 2, name: '二中队' },
      ],
    };
  }
  componentDidMount() {
    // this.getAllHouse();
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSearchData && this.props.handleSearchData(values);
      }
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({ year: null });
    this.props.handleReset && this.props.handleReset();
  };
  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }
  getAllHouse = () => {
    this.setState({ roomIdvisible: true });
    httpAjax('post', config.apiUrl + '/api/dogRoom/allHouse').then((res) => {
      if (res.code == '0') {
        this.setState({ allHouseData: res.data });
      }
    });
  };
  selectHouseId = () => {};
  onChangeStartTime = () => {};
  onChangeYear = () => {};
  selectTaskType = () => {};
  hangdleFeedback = () => {};
  hangdleCatch = () => {};
  handlePrif = () => {};
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    const { isopen, time } = this.state;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={4} lg={4} md={8} sm={12} xs={12}>
            <FormItem label="中队:" {...thirdLayout}>
              {getFieldDecorator('groupId')(
                <Select placeholder="请选择" allowClear onChange={this.selectHouseId}>
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
          <Col xl={4} lg={4} md={8} sm={12} xs={12}>
            <FormItem label="姓名:" {...thirdLayout}>
              {getFieldDecorator('userId')(
                <Select placeholder="请选择" allowClear onChange={this.selectHouseId}>
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
          <Col xl={5} lg={5} md={8} sm={12} xs={12}>
            <FormItem label="年份" {...thirdLayout}>
              {getFieldDecorator('year', {
                initialValue: time,
                rules: [
                  {
                    required: true,
                    message: '请选择年份',
                  },
                ],
              })(
                <DatePicker
                  mode="year"
                  open={isopen}
                  format="YYYY"
                  onOpenChange={(status) => {
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
                  placeholder="请选择"
                />
              )}
            </FormItem>
          </Col>
          <Col xl={5} lg={5} md={8} sm={12} xs={12}>
            <FormItem label="月份" {...thirdLayout}>
              {getFieldDecorator('month', {
                initialValue: null,
                rules: [
                  {
                    required: true,
                    message: '请选择月份',
                  },
                ],
              })(<MonthPicker placeholder="请选择" onChange={this.onChangeStartTime} />)}
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
