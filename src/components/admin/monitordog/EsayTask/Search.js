import React, {Component} from 'react';
import {Form, Row, Col, Input, Button, Icon, Select, DatePicker} from 'antd';
import {thirdLayout} from 'util/Layout';
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
    //this.searchPeople();
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
        taskName: values.taskName && values.taskName,
        queryTime: values.queryTime && values.queryTime.format('YYYY-MM-DD')
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
    React.$ajax.postData('/api/userCenter/getTrainer', {name}).then((res) => {
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
            <FormItem label="选择时间	" {...thirdLayout}>
              {getFieldDecorator('queryTime')(<DatePicker />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="任务名称" {...thirdLayout}>
              {getFieldDecorator('taskName')(<Input placeholder="任务名称" />)}
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
