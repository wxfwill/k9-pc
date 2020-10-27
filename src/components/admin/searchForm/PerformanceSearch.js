import React ,{ Component } from 'react'; 
import { Form, Row, Col, Input, Button, Icon ,Select,DatePicker  } from 'antd';
import { thirdLayout } from 'components/view/common/Layout';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const {MonthPicker } = DatePicker;
require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchValue:[],
      weekDate:''
    };
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({weekDate:''})
  }
  ChangeMonth=(date, dateString)=>{
    this.setState({weekDate:dateString})
  }
  handleSearch=(e)=>{
    e.preventDefault();
    let { limit } = this.props;
    const {weekDate}=this.state;
    limit(weekDate);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch} >
        <Row gutter={24}>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label="时间" {...thirdLayout}>
                {getFieldDecorator('weekDate',{
                  //initialValue:moment(new Date(defaultDate), dateFormat)
                })(
                  <MonthPicker onChange={this.ChangeMonth} placeholder="请选择查询时间"   />
                )}
              </FormItem>
            </Col>
        </Row>
         <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset.bind(this)}>
              清空
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const PerformanceSearch = Form.create()(SearchForm);

export default PerformanceSearch;


// WEBPACK FOOTER //
// ./src/components/admin/searchForm/PerformanceSearch.js