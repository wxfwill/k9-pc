import React ,{ Component } from 'react'; 
import { Form, Row, Col, Input, Button, Icon ,Select ,DatePicker} from 'antd';
import { thirdLayout } from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    expand: true,
    name:'',
    number:'',
    statisticsTime:''
  };
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    let timeData = 'statisticsTime'; 
    this.props.form.validateFields((err, fieldsValue) => {
      Object.keys(fieldsValue).forEach(function(item,index){
        typeof fieldsValue[item] == 'undefined'?fieldsValue[item]='':'';
      })
      if(fieldsValue.statisticsTime!=''){
        fieldsValue.statisticsTime=fieldsValue.statisticsTime.format('YYYY-MM');
      }
      limit(fieldsValue);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  handleChange(name,value){
    this.setState({
      [name]:value
    })
  }
  render() {
    let expand = this.state.expand;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={24}>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label={'姓名'} {...thirdLayout}>
                {getFieldDecorator('name')(
                  <Input placeholder="姓名" />
                )}
              </FormItem>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label={'警号'} {...thirdLayout}>
                {getFieldDecorator('number')(
                  <Input placeholder="警号" />
                )}
              </FormItem>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <FormItem label="统计年月" {...thirdLayout}>
                {getFieldDecorator('statisticsTime')(
                  <MonthPicker style={{width:'220px'}} />
                )}
              </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              清空
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const AttendSearch = Form.create()(SearchForm);

export default AttendSearch;


// WEBPACK FOOTER //
// ./src/components/view/searchForm/attend/AttendSearch.js