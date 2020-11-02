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
            roomData: {},
            videoData: [],
            allHouseData: [],
            name:'',
            houseId:'',
            videoId:''
        }
    }

    handleSubmit = () => {
        const {name, houseId,videoId  } = this.state;
        const Id = this.props.location.query && this.props.location.query.Id;

        const successMess = Id ?'修改成功' : '添加成功';
        const errorMess = Id ?'修改失败' : '添加失败';
        const parms = {name, houseId,videoId};
        if(Id) {
            parms.id = Id;
        }
        httpAjax('post',config.apiUrl+'/api/dogRoom/saveDogRoom', parms).then((res)=>{
            if(res.code==0){
                this.props.history.push('/app/room/info');
                message.success(successMess)
            }else{
                message.error(errorMess)
            }
        }).catch((error)=>{
            console.log(error)
        })

    }

    getAllHouse = () => {
		// this.setState({roomIdvisible: true});
		httpAjax('post', config.apiUrl+'/api/dogRoom/allHouse').then((res) => {
			if(res.code == '0') {
               let allHouseData= res.data.unshift({id:'',name:'请选择楼号'})
				this.setState({allHouseData: res.data})
			}
		})
  }
  getVideos = () => {
    httpAjax('post', config.apiUrl+'/api/video/listAll').then((res) => {
        if(res.code == '0') {
            this.setState({videoData: res.data, videoId: res.data[0].id})
        }
    })
  }

  handleReset = () => {
   
    this.props.form.resetFields();
  
  }

componentDidMount() {
    this.getAllHouse();
    this.getVideos();
    const Id = this.props.location.query && this.props.location.query.Id;
    const pathname = this.props.location.pathname;
    if(Id) {
        httpAjax('post',config.apiUrl+'/api/dogRoom/info', {id: Id}).then((res)=>{
            if(res.code==0){
                this.setState({roomData: res.data,...res.data})
            }else{
                message.error("请求失败")
            }
        }).catch((error)=>{
            console.log(error)
        })
        if(pathname.indexOf('infoDetail')>-1) {
           this.setState({isInitialValue: true, disabled: true})
        } else {
            this.setState({isInitialValue: true, disabled: false})
        }
    }
}

    render () {
        // console.log(this.props,this.state, 'asdasdq')
        const {getFieldDecorator}=this.props.form;
        const {isInitialValue, disabled, roomData, allHouseData, videoData} = this.state;
        return <div className="AddDogForm">
        <Row gutter={24}>
            <Col span={24}>
                <Card title='犬舍信息' bordered={true}>
                    <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Form className="ant-advanced-search-form">
                    <Row gutter={24}>
                    <Col xl={8} lg={12} md={12} sm={24} xs={24} >
                        <FormItem label='选择楼号：' {...secondLayout} hasFeedback>
                        {getFieldDecorator('houseId', {
                            rules:[{required:true,message:'请选择楼号'}],
                            initialValue:isInitialValue?roomData.houseName : allHouseData[0] && allHouseData[0].id
                        })(
                        !disabled?<Select style={{ width: 120 }}  onChange={(value) => {this.setState({houseId: value})}}>
                        {
                        this.state.allHouseData.map((item) => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>
                        })
                        }	
                        </Select>: <Input disabled={disabled}/>
                        )}
                        
                        </FormItem>
                    </Col>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <FormItem label='房间号' {...secondLayout} hasFeedback>
                     {getFieldDecorator('name',{
                         rules:[{required:true,message:'房间号'},{max:10,message:'房间号长度不能超过10'}],
                         initialValue:isInitialValue?roomData.name :""
                     })(
                             <Input placeholder="房间号" onChange={(e) => {this.setState({name: e.target.value})}} disabled={disabled}/>
                      )}
                    </FormItem>
                  </Col>
              </Row>
           {/*   <Row gutter={24}>
                <Col xl={8} lg={12} md={12} sm={24} xs={24} >
                    <FormItem label='选择视频：' {...secondLayout} hasFeedback>
                    {getFieldDecorator('videoId', {
                        rules:[{required:true,message:'请选择视频'}],
                        initialValue:isInitialValue?roomData.videoInfo&&roomData.videoInfo.code :videoData[0] && videoData[0].id
                    })(
                        !disabled?<Select style={{ width: 120 }} onChange={(value) => {this.setState({videoId: value})}}>
                    {
                        videoData.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                    })
                    }	
                    </Select>: <Input disabled={disabled}/>
                    )}
                    
                    </FormItem>
                </Col>
                  
              </Row>*/}
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
// ./src/components/admin/dogHouse/RoomEdit.js