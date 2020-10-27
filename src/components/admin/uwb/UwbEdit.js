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

class VideoInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitialValue:false,
            disabled: false,
            code: '',
            remark:'',
            videoData:{},
        }
    }

    handleSubmit = () => {

        const {code, remark  } = this.state;
        const VideoId = this.props.location.query && this.props.location.query.VideoId;

        const successMess = VideoId ?'修改成功' : '添加成功';
        const errorMess = VideoId ?'修改失败' : '添加失败';
        const parms = {code, remark };
        if(VideoId) {
            parms.id = VideoId;
        }

        this.props.form.validateFields((err, values) => {

            if(!err){

                httpAjax('post',config.apiUrl+'/api/equipmentInfo/saveUwbInfo', parms).then((res)=>{
                    if(res.code==0){
                        message.success(successMess);
                        this.props.history.push('/app/equipment/uwb')
                    }else{
                        message.error(errorMess)
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            }

        });

    }

    componentDidMount() {
        const VideoId = this.props.location.query && this.props.location.query.VideoId;
        const pathname = this.props.location.pathname;
        if(VideoId) {
            httpAjax('post',config.apiUrl+'/api/equipmentInfo/uwbInfo', {id: VideoId}).then((res)=>{
                if(res.code==0){
                    this.setState({videoData: res.data,...res.data})
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
        console.log(this.props,this.state, 'asdasdq')
        const {getFieldDecorator}=this.props.form;
        const {isInitialValue, disabled, videoData} = this.state;
        return <div className="AddDogForm">
        <Row gutter={24}>
            <Col span={24}>
                <Card title='UWB信息' bordered={true}>
                    <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Form className="ant-advanced-search-form">
                    <Row gutter={24}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <FormItem label='标签编号:' {...secondLayout}  hasFeedback>
                            {getFieldDecorator('code',{
                             rules: [{ required: true,whitespace:true, message: '请输入UWB标签编号' },{validator: this.checkNumber}],
                             initialValue:isInitialValue?videoData.code :""
                         })(
                            <Input placeholder="UWB标签编号" onChange={(e) => {this.setState({code: e.target.value})}}  disabled={disabled}/>
                          )}
                        </FormItem>
                  </Col>
              </Row>
              {
                <Row gutter={24}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <FormItem label='备注' {...secondLayout}  hasFeedback>
                            {getFieldDecorator('beizhu',{
                             // rules: [{ required: true,whitespace:true, message: '请输入档案编号' },{validator: this.checkNumber}],
                             initialValue:isInitialValue?videoData.remark :""
                         })(
                            <TextArea placeholder="备注" onChange={(e) => {this.setState({remark: e.target.value})}} autosize={{ minRows: 3, maxRows: 6 }} disabled={disabled}/>
                          )}
                        </FormItem>
                  </Col>
              </Row>
              }
              
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

const AddViewForm = Form.create()(VideoInfo);

const mapStateToProps = state => ({
  loginState: state.login
})

export default connect(
  mapStateToProps
)(AddViewForm)