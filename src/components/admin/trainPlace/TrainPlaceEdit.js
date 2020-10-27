import React from 'react';
import { connect } from 'react-redux';
import {Row,Col,Card,Form,Input,Icon,Radio,DatePicker ,Button,Select,Upload,message,Modal  } from 'antd';
import { firstLayout,secondLayout} from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
require('style/app/dogInfo/addDogForm.less');
const FormItem=Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;

class TrainPlaceEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitialValue:false,
            disabled: false,
            remark: '',
            name: '',
            trainPlaceData:{},
        }
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            let count=0,obj={}; 
            if(!err){
                const {remark, name  } = this.state;
                const id = this.props.location.query && this.props.location.query.id;

                const successMess = id ?'修改成功' : '添加成功';
                const errorMess = id ?'修改失败' : '添加失败';
                const parms = {remark, name};
                if(id) {
                    parms.id = id;
                }
                httpAjax('post',config.apiUrl+'/api/train/saveTranPlace', parms).then((res)=>{
                    if(res.code==0){
                        this.props.history.push('/app/basicData/trainPlace');
                        message.success(successMess)
                    }else{
                        message.error(errorMess)
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            }
        })
    }


    handleReset = () => {
   
        this.props.form.resetFields();
      
      }

componentDidMount() {
    const id = this.props.location.query && this.props.location.query.id;
    const pathname = this.props.location.pathname;
    if(id) {
        httpAjax('post',config.apiUrl+'/api/train/trainPlaceDetail', {id: id}).then((res)=>{
            if(res.code==0){
                this.setState({trainPlaceData: res.data,...res.data})
            }else{
                message.error("请求失败")
            }
        }).catch((error)=>{
            console.log(error)
        })
        if(pathname.indexOf('Detail')>-1) {
           this.setState({isInitialValue: true, disabled: true})
        } else {
            this.setState({isInitialValue: true, disabled: false})
        }
    }
}

    render () {
        // console.log(this.props,this.state, 'asdasdq')
        const {getFieldDecorator}=this.props.form;
        const {isInitialValue, disabled, trainPlaceData} = this.state;
        return <div className="AddDogForm">
        <Row gutter={24}>
            <Col span={24}>
                <Card title='场地信息' bordered={true}>
                    <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Form className="ant-advanced-search-form">
                    <Row gutter={24}>
                      
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='名称' {...secondLayout} hasFeedback>
                            {getFieldDecorator('name',{
                                rules:[{required:true,message:'请输入名称'}],
                                initialValue:isInitialValue?trainPlaceData.name :""
                            })(
                                    <Input placeholder="名称" onChange={(e) => {this.setState({name: e.target.value})}} disabled={disabled}/>
                            )}
                            </FormItem>
                        </Col>
              </Row>
              <Row gutter={24}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <FormItem label='备注' {...firstLayout}  >
                        {getFieldDecorator('remark',{
                        // rules: [{ required: true, message: '请选择时间' }],
                        rules: [{ max: 100, message: '备注长度不超过100' }],
                        initialValue:isInitialValue?trainPlaceData.remark :""
                        })(
                            <Input.TextArea placeholder="" onChange={(e) => {this.setState({remark: e.target.value})}} disabled={disabled} autosize={{ minRows: 2, maxRows: 24 }} />
                        )}
                    </FormItem>
                </Col>     
            </Row>
              
              {
                !disabled ?
                    <Row>
                      <Col span={24} style={{ textAlign: 'center',marginTop:'40px' }}>
                        <Button type="primary" htmlType='submit' onClick={this.handleSubmit}>提交</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                          清空
                        </Button>
                      </Col>
                    </Row> : ''
            }
                    </Form>
                    </Col>
                </Card>

            </Col>
            
        </Row>

        </div>
    }

}

const AddViewForm = Form.create()(TrainPlaceEdit);

const mapStateToProps = state => ({
  loginState: state.login
})
export default connect(
  mapStateToProps
)(AddViewForm)


// WEBPACK FOOTER //
// ./src/components/admin/trainPlace/TrainPlaceEdit.js