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
            playUrl: '',
            remark: '',
            userName:'',
            password: '',
            videoData: {}
        }
    }

    handleSubmit = () => {
        const {code,playUrl,remark,userName,  password  } = this.state;
        const VideoId = this.props.location.query && this.props.location.query.VideoId;

        const successMess = VideoId ?'修改成功' : '添加成功';
        const errorMess = VideoId ?'修改失败' : '添加失败';
        const parms = {code,playUrl,remark,userName,password};
        if(VideoId) {
            parms.id = VideoId;
        }

        this.props.form.validateFields((err, values) => {

            if(!err){

                httpAjax('post',config.apiUrl+'/api/video/saveInfo', parms).then((res)=>{
                    if(res.code==0){
                        message.success(successMess);
                        this.props.history.push('/app/equipment/video');
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
            httpAjax('post',config.apiUrl+'/api/video/info', {id: VideoId}).then((res)=>{
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
        // console.log(this.props,this.state, 'asdasdq')
        const {getFieldDecorator}=this.props.form;
        const {isInitialValue, disabled, videoData} = this.state;
        return <div className="AddDogForm">
        <Row gutter={24}>
            <Col span={24}>
                <Card title='视频信息' bordered={true}>
                    <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Form className="ant-advanced-search-form">
                    <Row gutter={24}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <FormItem label='视频编号' {...secondLayout}  hasFeedback>
                            {getFieldDecorator('number',{
                             rules: [{ required: true,whitespace:true, message: '请输入视频编号' },{validator: this.checkNumber}],
                             initialValue:isInitialValue?videoData.code :""
                         })(
                            <Input placeholder="视频编号" onChange={(e) => {this.setState({code: e.target.value})}}  disabled={disabled}/>
                          )}
                        </FormItem>
                  </Col>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label='URL' {...secondLayout} hasFeedback>
                     {getFieldDecorator('videoUrl',{
                         rules:[{required:true,message:'请输入URL地址'}],
                         initialValue:isInitialValue?videoData.playUrl :""
                     })(
                             <Input placeholder="视频的URL" onChange={(e) => {this.setState({playUrl: e.target.value})}} disabled={disabled}/>
                      )}
                    </FormItem>
                  </Col>
              </Row>
              <Row gutter={24}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <FormItem label='用户名' {...secondLayout}  hasFeedback>
                            {getFieldDecorator('name',{
                             rules: [{ required: true,whitespace:true, message: '请输入用户名' },{validator: this.checkNumber}],
                             initialValue:isInitialValue?videoData.userName :""
                         })(
                            <Input placeholder="用户名"  onChange={(e) => {this.setState({userName: e.target.value})}}  disabled={disabled}/>
                          )}
                        </FormItem>
                  </Col>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label='密码' {...secondLayout} hasFeedback>
                     {getFieldDecorator('password',{
                         rules:[{required:true,message:'请输入密码'}],
                         initialValue:isInitialValue?videoData.password :""
                     })(
                             <Input placeholder="密码" onChange={(e) => {this.setState({password: e.target.value})}} disabled={disabled}/>
                      )}
                    </FormItem>
                  </Col>
              </Row>
              {
            //     <Row gutter={24}>
            //             <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            //             <FormItem label='备注' {...secondLayout}  hasFeedback>
            //                 {getFieldDecorator('beizhu',{
            //                  // rules: [{ required: true,whitespace:true, message: '请输入档案编号' },{validator: this.checkNumber}],
            //                  initialValue:isInitialValue?videoData.remark :""
            //              })(
            //                 <TextArea placeholder="备注" onChange={(e) => {this.setState({remark: e.target.value})}} autosize={{ minRows: 3, maxRows: 6 }} disabled={disabled}/>
            //               )}
            //             </FormItem>
            //       </Col>
            //   </Row>
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


// WEBPACK FOOTER //
// ./src/components/admin/video/addVideo.js