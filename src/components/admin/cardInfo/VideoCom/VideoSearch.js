import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      dutyList: [],
    };
  }
  componentWillMount() {
    // //获取职务信息
    // httpAjax("post",config.apiUrl+'/api/basicData/dutyList',{}).then(res=>{
    //   if(res.code==0){
    //     this.setState({dutyList:res.data});
    //      sessionStorage.setItem("dutyList",JSON.stringify(res.data));
    //   }
    // })
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
  render() {
    const { getFieldDecorator } = this.props.form;
    let { expand, dutyList } = this.state;
    const dutyListOption =
      dutyList &&
      dutyList.map((item, index) => {
        return (
          <Option value={item.id} key={index}>
            {item.name}
          </Option>
        );
      });
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="车牌号	" {...thirdLayout}>
              {getFieldDecorator('number')(<Input placeholder="车牌号	" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="车类型	" {...thirdLayout}>
              {getFieldDecorator('useage')(
                <Select>
                  <Option value="1">运犬车</Option>
                  <Option value="2">公务车</Option>
                </Select>
              )}
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

const UserSearch = Form.create()(SearchForm);
export default UserSearch;
