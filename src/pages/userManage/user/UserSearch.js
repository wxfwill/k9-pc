import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd';
import { thirdLayout } from 'util/Layout';
import { connect } from 'react-redux';
import * as formData from 'pages/userManage/user/userData';
// import GlobalTeam from 'components/searchForm/GlobalTeam';
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');

@connect((state) => ({ navData: state.commonReducer.navData }))
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      dutyList: [], //职务信息
    };
  }
  componentDidMount() {
    //获取职务信息
    React.$ajax.postData('/api/basicData/dutyList').then((res) => {
      if (res.code == 0) {
        this.setState({ dutyList: res.data });
      }
    });
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
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="警名姓名" {...thirdLayout}>
              {getFieldDecorator('policeName')(<Input placeholder="警名姓名" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="警员编号" {...thirdLayout}>
              {getFieldDecorator('policeNumber')(<Input placeholder="警员编号" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="职务" {...thirdLayout}>
              {getFieldDecorator('duty')(
                <Select placeholder="职务">
                  {dutyList &&
                    dutyList.map((item, index) => {
                      return (
                        <Option value={item.id} key={index}>
                          {item.name}
                        </Option>
                      );
                    })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="职称" {...thirdLayout}>
              {getFieldDecorator('title')(
                <Select placeholder="职称" allowClear>
                  {formData.titleArr.map((item, index) => {
                    return (
                      <Option value={item.id} key={index}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <GlobalTeam form={this.props.form} teamLabel="groupIds"></GlobalTeam>
          </Col> */}

          <Col xl={8} lg={12} md={12} sm={24} xs={24} style={{ textAlign: 'center' }}>
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
