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
      dogBreed: [],
      workUnitList: [],
      trainerList: [],
    };
  }
  componentWillMount() {
    //获取犬只品种下拉项
    this.getTrainer();
    httpAjax('post', config.apiUrl + '/api/basicData/dogBreed', {}).then((res) => {
      if (res.code == 0) {
        this.setState({ dogBreed: res.data });
        sessionStorage.setItem('dogBreeds', JSON.stringify(res.data));
      }
    });
    //获取服役单位下拉项
    httpAjax('post', config.apiUrl + '/api/basicData/workUnitList', {}).then((res) => {
      if (res.code == 0) {
        this.setState({ workUnitList: res.data });
        sessionStorage.setItem('workUnitList', JSON.stringify(res.data));
      }
    });
    // 获取带犬员信息
  }
  getTrainer = (name = '') =>
    httpAjax('post', config.apiUrl + '/api/userCenter/getTrainer', { name }).then((res) => {
      if (res.code == 0) {
        this.setState({ trainerList: res.data });
      }
    });
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
    let { expand, dogBreed, workUnitList, trainerList } = this.state;
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
    let service = '',
      duty = '';
    if (this.props.type == 'service') {
      service = '0';
    } else if (this.props.type == 'duty') {
      duty = '1';
    }
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="犬只" {...thirdLayout}>
              {getFieldDecorator('dogName')(<Input placeholder="犬名" />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="品种" {...thirdLayout}>
              {getFieldDecorator('breed')(<Select placeholder="品种">{dogBreedOption}</Select>)}
            </FormItem>
          </Col>
          {/*style={{display:expand?'none':'block'}}*/}

          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <FormItem label="服役单位" {...thirdLayout}>
              {getFieldDecorator('serviceUnit')(<Select placeholder="服役单位">{workUnitOption}</Select>)}
            </FormItem>
          </Col>

          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ display: expand ? 'none' : 'block' }}>
            <FormItem label="带犬员" {...thirdLayout}>
              {getFieldDecorator(
                'trainerIds',
                {}
              )(
                <Select
                  mode="multiple"
                  labelInValue
                  //value={value}
                  placeholder="请选择带犬员"
                  //notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.getTrainer}
                  // onChange={(value) => {console.log(value)}}
                  //style={{ width: '100%' }}
                >
                  {trainerList.map((t) => (
                    <Option value={t.id} key={t.id}>
                      {t.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ display: expand ? 'none' : 'block' }}>
            <FormItem label="性别" {...thirdLayout}>
              {getFieldDecorator(
                'sex',
                {}
              )(
                <Select placeholder="性别">
                  <Option value="1">公犬</Option>
                  <Option value="0">母犬</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ display: expand ? 'none' : 'block' }}>
            <FormItem label="服役状态" {...thirdLayout}>
              {getFieldDecorator('serviceStatus', {
                initialValue: service,
              })(
                <Select placeholder="服役状态">
                  <Option value="0">服役中</Option>
                  <Option value="1">退役</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ display: expand ? 'none' : 'block' }}>
            <FormItem label="出勤状态" {...thirdLayout}>
              {getFieldDecorator('onduty', {
                initialValue: duty,
              })(
                <Select placeholder="出勤状态">
                  <Option value="1">出勤</Option>
                  <Option value="0">未出勤</Option>
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
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '展开' : '收起'} <Icon type={this.state.expand ? 'down' : 'up'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const DogSearch = Form.create()(SearchForm);
export default DogSearch;

// WEBPACK FOOTER //
// ./src/components/admin/searchForm/DogManage/DogInforSearch.js
