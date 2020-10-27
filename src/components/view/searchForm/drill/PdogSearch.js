import React ,{ Component } from 'react'; 
import { Form, Row, Col, Input, Button, Icon ,Select,DatePicker} from 'antd';
import { thirdLayout } from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    expand: true,
    subjectId:'',
    dogName:'',
    typeOption:[],
  };
  componentWillMount() {
    let _this = this;
    let typeOption = httpAjax('post',config.apiUrl+'/api/trainingSubject/getAllTrainSubjectName');
    Promise.all([typeOption]).then((resArr)=>{
      _this.setState({
        typeOption:resArr[0].data,
      })
    })
  }
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    let timeData = 'range-time-picker';
    this.props.form.validateFields((err, fieldsValue) => {
      const rangeTimeValue = fieldsValue['range-time-picker'];
      let rangeValueArr = ["",""];
      if(!(typeof rangeTimeValue=='undefined'||rangeTimeValue.length==0)){
         rangeValueArr =[rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss')];
      }
      const values = {
        ...fieldsValue,
        'range-time-picker':rangeValueArr
      };
      let subData ={
        startTime:values[timeData][0],
        endTime:values[timeData][1],
        subjectId:values.subjectId,
        dogName:values.dogName
      };
      Object.keys(subData).forEach(function(item,index){
        typeof subData[item] == 'undefined'?subData[item]='':'';
      })
      limit(subData);
    });
  }
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  handleChange(name,value){
    this.setState({
      [name]:value
    })
  }
  render() {
    let expand = this.state.expand;
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', message: 'Please select time!' }],
    };
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={24}>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label={"训练科目"} {...thirdLayout}>
               {getFieldDecorator('subjectId')(
                  <Select placeholder="训练科目" >
                    {this.state.typeOption.map((item,index)=>{
                      return(
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label={'犬名'} {...thirdLayout}>
                {getFieldDecorator('dogName')(
                  <Input placeholder="犬名" />
                )}
              </FormItem>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label="时间范围" {...thirdLayout}>
                {getFieldDecorator('range-time-picker', rangeConfig)(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"style={{width:'220px'}} />
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
            {/*<a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '展开' : '收起'}  <Icon type={this.state.expand ? 'down': 'up' } />
            </a>*/}
          </Col>
        </Row>
      </Form>
    );
  }
}

const ScheduleManageSearch = Form.create()(SearchForm);

export default ScheduleManageSearch;


// WEBPACK FOOTER //
// ./src/components/view/searchForm/drill/PdogSearch.js