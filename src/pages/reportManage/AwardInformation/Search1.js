import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Radio, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import moment from 'moment';
import httpAjax from 'libs/httpAjax';
import RequestHoc from 'components/searchForm/GlobalSearchHoc';
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
      feedbalVal: null,
    };
  }
  componentDidMount() {
    // this.getAllHouse();
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
    let { expand, dutyList } = this.state;
    return (
      <React.Fragment>
        <Col xl={6} lg={6} md={8} sm={12} xs={12}>
          <FormItem label="完成时间" {...thirdLayout}>
            {getFieldDecorator('repDateStart', {
              initialValue: null,
            })(<DatePicker placeholder="请输入" onChange={this.onChangeStartTime} />)}
          </FormItem>
        </Col>
        <Col xl={6} lg={6} md={8} sm={12} xs={12}>
          <FormItem label="任务类型" {...thirdLayout} hasFeedback>
            {getFieldDecorator('categoryIds')(
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
        <Col xl={6} lg={6} md={8} sm={12} xs={12}>
          <FormItem
            label="审批状态"
            labelCol={{ xl: { span: 9 }, md: { span: 10 }, sm: { span: 12 }, xs: { span: 12 } }}
          >
            {getFieldDecorator('isFeedback', {
              initialValue: this.state.feedbalVal,
            })(
              <Radio.Group onChange={this.hangdleFeedback}>
                <Radio value={true}>已通过</Radio>
                <Radio value={false}>已撤销</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Col>
      </React.Fragment>
    );
  }
}

const InfoSearch = Form.create()(SearchForm);
export default RequestHoc({})(InfoSearch);
