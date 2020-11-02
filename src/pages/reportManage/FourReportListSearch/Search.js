import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Radio, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'components/view/common/Layout';
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
      allHouseData: [
        {
          id: 1,
          name: '一中队',
        },
        {
          id: 2,
          name: '二中队',
        },
      ],
      taksTypeData: [
        {
          id: 0,
          title: '外出任务',
        },
        {
          id: 1,
          title: '内务任务',
        },
      ],
      feedbalVal: 0,
      successVal: 1,
    };
  }
  componentWillMount() {
    //获取职务信息
    // httpAjax("post",config.apiUrl+'/api/basicData/dutyList',{}).then(res=>{
    //   if(res.code==0){
    //     this.setState({dutyList:res.data});
    //      sessionStorage.setItem("dutyList",JSON.stringify(res.data));
    //   }
    // })
  }
  componentDidMount() {
    // this.getAllHouse();
  }
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    let timeData = 'range-time-picker';
    this.props.form.validateFields((err, values) => {
      limit(values);
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
  onChangeEndTime = () => {};
  selectTaskType = () => {};
  hangdleFeedback = () => {};
  hangdleCatch = () => {};
  handlePrif = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    let { expand, dutyList } = this.state;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="中队:" {...thirdLayout}>
              {getFieldDecorator('team')(
                <Select placeholder="请选择" allowClear onChange={this.selectHouseId}>
                  {this.state.allHouseData.map((item) => {
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
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input placeholder="请输入" allowClear />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="开始时间" {...thirdLayout}>
              {getFieldDecorator('startTime', {
                initialValue: null,
              })(<DatePicker placeholder="请输入" onChange={this.onChangeStartTime} />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="结束时间" {...thirdLayout}>
              {getFieldDecorator('endTime', {
                initialValue: null,
              })(<DatePicker placeholder="请输入" onChange={this.onChangeEndTime} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xl={6} lg={6} md={8} sm={12} xs={12}>
            <FormItem label="任务类型" {...thirdLayout} hasFeedback>
              {getFieldDecorator('taskType')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear onChange={this.selectTaskType}>
                  {this.state.taksTypeData.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.title}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={4} lg={4} md={8} sm={12} xs={12}>
            <FormItem
              label="是否反馈"
              labelCol={{ xl: { span: 9 }, md: { span: 10 }, sm: { span: 12 }, xs: { span: 12 } }}
            >
              {getFieldDecorator('feedback', {
                initialValue: this.state.feedbalVal,
              })(
                <Radio.Group onChange={this.hangdleFeedback}>
                  <Radio value={0}>是</Radio>
                  <Radio value={1}>否</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col xl={4} lg={4} md={8} sm={12} xs={12}>
            <FormItem
              label="是否抓捕成功"
              labelCol={{ xl: { span: 9 }, md: { span: 10 }, sm: { span: 12 }, xs: { span: 12 } }}
            >
              {getFieldDecorator('catch', {
                initialValue: this.state.successVal,
              })(
                <Radio.Group onChange={this.hangdleCatch}>
                  <Radio value={0}>是</Radio>
                  <Radio value={1}>否</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col xl={4} lg={4} md={8} sm={12} xs={12}>
            <FormItem label="地点" {...thirdLayout}>
              {getFieldDecorator('place', {
                initialValue: '',
              })(<Input placeholder="请输入" allowClear />)}
            </FormItem>
          </Col>
          <Col span={6} lg={6} md={8} sm={12} xs={12}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              清空
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handlePrif}>
              打印
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const InfoSearch = Form.create()(SearchForm);
export default InfoSearch;
