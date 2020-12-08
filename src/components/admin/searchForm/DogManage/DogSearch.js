import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { thirdLayout } from 'util/Layout';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      dogBreed: [],
      workUnitList: [],
    };
  }
  componentWillMount() {
    //获取犬只品种下拉项
    React.$ajax.postData('/api/basicData/dogBreed', {}).then((res) => {
      if (res.code == 0) {
        this.setState({ dogBreed: res.data });
        sessionStorage.setItem('dogBreeds', JSON.stringify(res.data));
      }
    });
    //获取服役单位下拉项
    React.$ajax.postData('/api/basicData/workUnitList', {}).then((res) => {
      if (res.code == 0) {
        this.setState({ workUnitList: res.data });
        sessionStorage.setItem('workUnitList', JSON.stringify(res.data));
      }
    });
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
    let { expand, dogBreed, workUnitList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const dogBreedOption =
      dogBreed &&
      dogBreed.map((item, index) => {
        return (
          <Option value={item.id} key={index}>
            {item.name}
          </Option>
        );
      });
    const workUnitOption =
      workUnitList &&
      workUnitList.map((item, index) => {
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
            <FormItem label="犬只" {...thirdLayout}>
              {getFieldDecorator('dogName')(<Input placeholder="犬只" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="犬只品种" {...thirdLayout}>
              {getFieldDecorator('breed')(<Select placeholder="犬只品种">{dogBreedOption}</Select>)}
            </FormItem>
          </Col>
          {/*<Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label='训导员' {...thirdLayout}>
                {getFieldDecorator('duty')(
                  <Input placeholder="训导员" />
                )}
              </FormItem>
            </Col>*/}

          {/*style={{display:expand?'none':'block'}}*/}

          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <FormItem label="服役单位" {...thirdLayout}>
              {getFieldDecorator('serviceUnit')(<Select placeholder="服役单位">{workUnitOption}</Select>)}
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
            {/*<a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '展开' : '收起'}  <Icon type={this.state.expand ? 'down': 'up' } />
            </a>*/}
          </Col>
        </Row>
      </Form>
    );
  }
}

const DogSearch = Form.create()(SearchForm);
export default DogSearch;
