import React ,{ Component } from 'react'; 
import { Form, Row, Col, Input, Button, Icon ,Select ,DatePicker} from 'antd';
import { thirdLayout } from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expand: true, 
      vaccineType:[],  
    };
  }
  componentWillMount(){
    //获取疫苗名称下拉项
    // httpAjax("post",config.apiUrl+'/api/basicData/vaccineType',{}).then(res=>{
    //   if(res.code==0){
    //     this.setState({vaccineType:res.data});
    //     sessionStorage.setItem("vaccineType",JSON.stringify(res.data)); 
    //   }
    // })    
  }
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    this.props.form.validateFields((err, values) => {
      limit(values);
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
    let {expand,vaccineType }= this.state;
    const { getFieldDecorator } = this.props.form;
    const vaccineOption= vaccineType&&vaccineType.map((item,index)=>{
      return <Option value={item.id} key={index}>{item.name}</Option>
    })   
    return (
      <Form className="ant-advanced-search-form"  onSubmit={this.handleSearch} >
        <Row gutter={24}>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label='计划名称' {...thirdLayout}>
                {getFieldDecorator('name')(
                  <Input placeholder="计划名称" />
                )}
              </FormItem>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label='执行状态' {...thirdLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="执行状态" >
                    {/* {vaccineOption} */}
                    {/* <Option value="">全部</Option> */}
                    <Option value="1">已执行</Option>
                    <Option value="0">未执行</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {/*style={{display:expand?'none':'block'}}*/}

            {/*<Col xl={8} lg={24} md={24} sm={24} xs={24} >  
              <FormItem label='服役单位' {...thirdLayout}>
                {getFieldDecorator('serviceUnit')(
                  <Select placeholder="服役单位" >
                    {workUnitOption}
                  </Select>
                )}
              </FormItem>
            </Col>
            */}
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

const DogSearch = Form.create()(SearchForm);
export default DogSearch;


// WEBPACK FOOTER //
// ./src/components/admin/searchForm/DogManage/DogPreventionSearch.js