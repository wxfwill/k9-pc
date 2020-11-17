import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Divider } from 'antd';
import { thirdLayout } from 'util/Layout';
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      dutyList: [],
    };
  }
  componentDidMount() {
    //获取职务信息
    // React.$ajax.postData('/api/basicData/dutyList').then((res) => {
    //   if (res.code == 0) {
    //     this.setState({ dutyList: res.data });
    //     sessionStorage.setItem('dutyList', JSON.stringify(res.data));
    //   }
    // });
  }
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
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
            <FormItem label="角色名称" {...thirdLayout}>
              {getFieldDecorator('policeName')(<Input placeholder="角色名称" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="角色编码" {...thirdLayout}>
              {getFieldDecorator('policeNumber')(<Input placeholder="角色编码" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const RoleSearch = Form.create()(SearchForm);
export default RoleSearch;
