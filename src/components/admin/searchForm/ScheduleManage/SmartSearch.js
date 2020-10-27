import React ,{ Component } from 'react'; 
import { Form, Row, Col, Button ,DatePicker} from 'antd';
import { thirdLayout } from 'components/common/Layout';
import moment from 'moment';
const FormItem = Form.Item;
class SearchForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
  }
  onChange(field, value){
    this.setState({
      [field]: value,
    });
  }
  disabledStartDate =(startValue)=> {
 
    const endValue = this.state.endValue;
  //  return (moment(startValue).format('d')!=1)|| (startValue && startValue < moment().endOf('day'));
     return (moment(startValue).format('d')!=1) ;
  }

  disabledEndDate =(endValue)=>  {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return  (moment(endValue).format('d')!=0) || endValue.valueOf() <= startValue.valueOf();
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
     this.props.form.validateFields((err, fieldsValue) => {
      if (fieldsValue.startTime!="undefined"&&fieldsValue.endTime!="undefined"){
        Object.keys(fieldsValue).forEach(function(item,index){
          typeof fieldsValue[item] == 'undefined'?fieldsValue[item]='': fieldsValue[item] = fieldsValue[item].format('YYYY-MM-DD');
        })
        limit(fieldsValue);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={24}>
            <Col xxl={8} xl={12} lg={16} md={24} sm={24} xs={24} >
              <FormItem label="日期">
                <Col span={11}>
                  {getFieldDecorator('startTime',)(
                    <DatePicker
                      disabledDate={this.disabledStartDate.bind(this)}
                      format="YYYY-MM-DD"
                      placeholder="开始时间"
                      onChange={this.onChange.bind(this,'startValue')}
                      onOpenChange={this.handleStartOpenChange}
                    />
                  )}
                </Col>
                <Col span={2}>
                  <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                    至
                  </span>
                </Col>
                <Col span={11}>
                  <FormItem>
                    {getFieldDecorator('endTime',)(
                      <DatePicker
                        disabledDate={this.disabledEndDate.bind(this)}
                        format="YYYY-MM-DD"
                        placeholder="结束时间"
                        onChange={this.onChange.bind(this,'endValue')}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                      />
                    )}
                  </FormItem>
                </Col>
              </FormItem>
            </Col>
            <Col xxl={2} xl={4} lg={4} md={4} sm={24} xs={24} >
              <Button type="primary" htmlType="submit">生成</Button>
            </Col>            
        </Row>
      </Form>
    );
  }
}

const SmartSearch = Form.create()(SearchForm);
export default SmartSearch;


// WEBPACK FOOTER //
// ./src/components/admin/searchForm/ScheduleManage/SmartSearch.js