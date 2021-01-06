import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select, DatePicker} from 'antd';
import {thirdLayout} from 'util/Layout';
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
      peoples: []
    };
  }
  componentDidMount() {
    this.searchPeople();
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
    const {limit} = this.props;
    const timeData = 'range-time-picker';
    this.props.form.validateFields((err, values) => {
      limit({
        type: values.type && values.type,
        startTime: values.times && values.times[0].format('x'),
        endTime: values.times && values.times[1].format('x'),
        userId: values.userId && values.userId
      });
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
  searchPeople = (name = '') => {
    httpAjax('post', config.apiUrl + '/api/userCenter/getTrainer', {name}).then((res) => {
      if (res.code == 0) {
        this.setState({peoples: res.data});
      }
    });
  };
  render() {
    const {getFieldDecorator} = this.props.form;
    const {expand, dutyList, peoples} = this.state;
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
      <Form className="ant-advanced-search-form">
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="请假类型	" {...thirdLayout}>
              {getFieldDecorator('type')(
                <Select>
                  <Option value="1">调休</Option>
                  <Option value="2">事假</Option>
                  <Option value="3">年假</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="请假人员	" {...thirdLayout}>
              {getFieldDecorator('userId')(
                <Select
                  placeholder="请假人员"
                  optionLabelProp="children"
                  showSearch
                  autosize={{minRows: 2, maxRows: 24}}
                  // onChange={(a,b,c) => {console.log(a,b,c)}}
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
            <FormItem label="选择时间	" {...thirdLayout}>
              {getFieldDecorator('times')(<RangePicker />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
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

const UserSearch = Form.create()(SearchForm);
export default UserSearch;
