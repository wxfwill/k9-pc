import React ,{ Component } from 'react'; 
import { Form, Row, Col, Input, Button, Icon ,Select, DatePicker} from 'antd';
import { thirdLayout } from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
const FormItem = Form.Item;
const Option = Select.Option;

require('style/view/common/conduct.less');
class SearchForm extends React.Component {
  state = {
    expand: true,
    trainType:'',
    trainLevel:'',
    typeOption:[],
    LevelOption:[]
  };
  componentWillMount() {

  }
  handleSearch = (e) => {
    e.preventDefault();
    let { limit } = this.props;
    this.props.form.validateFields((err, values) => {
      Object.keys(values).forEach(function(item,index){
        typeof values[item] == 'undefined'?values[item]='':'';
      })
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
    let expand = this.state.expand;
    const { getFieldDecorator } = this.props.form;
    let optionArr = ['初级','中级','高级'];
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={24}>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} >
              <FormItem label={'队名'} {...thirdLayout}>
                {getFieldDecorator('teamName')(
                    <Input placeholder="请输入队名" />
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

const SubSearch = Form.create()(SearchForm);

export default SubSearch;


// WEBPACK FOOTER //
// ./src/components/view/searchForm/drill/TeamSearch.js