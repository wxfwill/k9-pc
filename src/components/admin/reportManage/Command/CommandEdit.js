import React from 'react';
import { connect } from 'react-redux';
import {Row,Col,Card,Form,Input,Icon,Radio,DatePicker ,Button,Select,message,Tooltip  } from 'antd';
import { firstLayout,secondLayout} from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
import PeoModal from 'components/admin/common/PeoModal';
import moment from 'moment';
require('style/app/dogInfo/addDogForm.less');
const FormItem=Form.Item;
const Option = Select.Option;


class CommandEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitialValue:false,
            disabled: false,
            remark: '',
            name: '',
            peoValue: '',
            targetKeys:[],//保存任务执行人员key
            peoples:[],
            peoVisible: false, 
            commandDetail:{},
        }
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                const id = this.props.location.query && this.props.location.query.id;

                const successMess = id ?'修改成功' : '添加成功';
                const errorMess = id ?'修改失败' : '添加失败';
                const options = values;
                let {peoples} = this.state;
                let param = {};
				if(options.recordTime){
					options.recordTime = moment(new Date(values.recordTime)).format('x');
                }	
                if(options.taskTime){
					options.taskTime = moment(new Date(values.taskTime)).format('x');
                }
                if(options.reportUserId){
                    peoples.map((item)=>{
                        if(item.id==options.reportUserId){
                            options.reportUserName=item.name;
                        }
                    })
                }	
                if(options.recordUserId){
                    peoples.map((item)=>{
                        if(item.id==options.recordUserId){
                            options.recordUserName=item.name;
                        }
                    })
                }
                if(options.userIds){
					options.userIds =this.state.targetKeys;
				}		
				Object.keys(options).forEach((item,index)=>{
					if(options[item]!=undefined||options[item]!=''){
						param[item]=options[item];
					}					
                })
                if(id) {
                    param.id = id;
                }
                httpAjax('post',config.apiUrl+'/api/command4w/save', param).then((res)=>{
                    if(res.code==0){
                        this.props.history.push('/app/report/4wcommand');
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
        this.setState({
            peoValue:'',
            targetKeys:[],
        })
      }
componentDidMount() {
    //部门数据
    httpAjax("post",config.apiUrl+'/api/basicData/userGroup',{}).then(res=>{
        if(res.code==0){
            this.setState({groupList:res.data})
        }
    })	

    //人员信息
    httpAjax('post',config.apiUrl+'/api/userCenter/getTrainer',{name}).then(res => {
        if(res.code == 0) {
            this.setState({peoples: res.data})
        }
       
    })

    const id = this.props.location.query && this.props.location.query.id;
    const pathname = this.props.location.pathname;
    if(id) {
        httpAjax('post',config.apiUrl+'/api/command4w/queryDetail', {id: id}).then((res)=>{
            if(res.code==0){
                const peoValue = res.data.userVOS.map((t) => t.name);
                const targetKeys = res.data.userVOS.map((t) => t.id);
                this.setState({commandDetail: res.data,...res.data,peoValue:peoValue.join(','),targetKeys:targetKeys})
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

handleCancel = (e) => {
    this.setState({
      peoVisible: false,
    });
  }
  handleAdd(peopleMsg) {
    let values = [];
    let targetKeys = [];
    let arr = [];
    peopleMsg.forEach((item, index) => {
      values.push(item.name);
      targetKeys.push(item.key);
      arr.push({id: item.key, name: item.name})
    })
    this.props.form.setFieldsValue({
      userIds: values.join(',')
    });
    this.setState({
      peoValue: values.join(','),
      targetKeys: targetKeys,
      reportArr: arr
    })
    this.setState({ peoVisible: false });
    // if(!arr.some((item) => item.id == this.reportUserId)){
    //     this.props.form.resetFields(['reportUserId','']);
    // }
  }

  addPeople() {
    this.setState({ peoVisible: true });
  }
    render () {
        // console.log(this.props,this.state, 'asdasdq')
        const {getFieldDecorator}=this.props.form;
        const {isInitialValue, disabled, commandDetail,groupList,peoples,peoVisible,targetKeys,peoValue} = this.state;
        const  groupOption=groupList&&groupList.map((item,index)=>{
	    	return <Option  value={item.id} key={index}>{item.name}</Option>
		})  
        return <div className="AddDogForm">
        <Row gutter={24}>
            <Col span={24}>
                <Card title='4w指挥信息' bordered={true}>
                    <Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
                    <Form >
                    <Row gutter={24}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='记录时间' {...secondLayout}  >
                                {getFieldDecorator('recordTime',{
                                    rules: [{ required: true, message: '请选择记录时间' }],
                                    initialValue:isInitialValue?commandDetail.recordTime ?(commandDetail.recordTime&&moment(new Date(commandDetail.recordTime))) :'':''
                                })(
                                    <DatePicker disabled={disabled} />
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='来源' {...secondLayout} >
                            {getFieldDecorator('source',{
                            rules: [{ required: true, message: '请输入来源' }],
                            initialValue:isInitialValue?commandDetail.source? commandDetail.source :"" : ""
                            })(
                                <Input placeholder="来源"  disabled={disabled}/>
                            )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='类别' {...secondLayout}  >
                                {getFieldDecorator('type',{
                                rules: [{ required: true, message: '请选择类别' }],
                                initialValue:isInitialValue? commandDetail.type ? commandDetail.type :"" :""
                                })(
                                    <Select disabled={disabled}>
                                        <Option value={""}>请选择类别</Option>	
                                        <Option value={1}>刑事案件</Option>
                                        <Option value={2}>搜爆安检</Option>
                                        <Option value={3}>日常事务</Option>
                                        <Option value={4}>会议</Option>
                                        <Option value={5}>领导交办</Option>
                                        <Option value={6}>日常诊疗</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='部门' {...secondLayout} >
                            {getFieldDecorator('groupId',{
                            rules: [{ required: true, message: '请选择所属中队' }],
                            initialValue:isInitialValue?commandDetail.groupId? commandDetail.groupId :"" : ""
                            })(
                                <Select disabled={disabled}>
                                    <Option value={""}>请选择所属中队</Option>
                                    {groupOption}
                                </Select>
                            )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='汇报人' {...secondLayout}  >
                                {getFieldDecorator('reportUserId',{
                                rules: [{ required: true, message: '请选择汇报人' }],
                                initialValue:isInitialValue? commandDetail.reportUserId ? commandDetail.reportUserId :"" :""
                                })(
                                    <Select placeholder="请选择汇报人"  
                                        disabled={disabled}
                                        optionLabelProp="children" 
                                        showSearch autosize={{ minRows: 2, maxRows: 24 }}
                                        // onChange={(a,b,c) => {console.log(a,b,c)}}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {peoples.map((item) => <Option value={item.id} key={item.id+'_peo'}>{item.name}</Option>)}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='记录人' {...secondLayout} >
                            {getFieldDecorator('recordUserId',{
                            rules: [{ required: true, message: '请选择记录人' }],
                            initialValue:isInitialValue?commandDetail.recordUserId? commandDetail.recordUserId :"" : ""
                            })(
                                <Select placeholder="请选择记录人"  
                                        disabled={disabled}
                                        optionLabelProp="children" 
                                        showSearch autosize={{ minRows: 2, maxRows: 24 }}
                                        // onChange={(a,b,c) => {console.log(a,b,c)}}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {peoples.map((item) => <Option value={item.id} key={item.id+'_peo'}>{item.name}</Option>)}
                                    </Select>
                            )}
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="ant-advanced-search-form">
                        <Row gutter={24}>
                        
                                

                                  <Col xl={12} lg={12} md={24} sm={24} xs={24} >
                                    <FormItem label={'选择任务执行人'} {...secondLayout} hasFeedback >
                                        {getFieldDecorator('userIds', {
                                        rules: [{ required: true, message: '请添加任务执行人' }],
                                        initialValue: peoValue || ''
                                        })(
                                        <Tooltip
                                            trigger={['hover']}
                                            title={peoValue}
                                            placement="topLeft"
                                            overlayClassName="numeric-input"
                                        >
                                            <Input placeholder="任务执行人" value={peoValue} disabled={disabled} addonBefore={<Icon type="plus" style={{ cursor: 'pointer' }} onClick={this.addPeople.bind(this)} />} />
                                        </Tooltip>
                                        )}
                                    </FormItem>
                                    </Col>
                                <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                    <FormItem label='任务执行时间' {...secondLayout} hasFeedback>
                                    {getFieldDecorator('taskTime',{
                                        rules:[{required:true,message:'请选择任务执行时间'}],
                                        initialValue:isInitialValue?commandDetail.taskTime ?(commandDetail.taskTime&&moment(new Date(commandDetail.taskTime))) :'':''
                                    })(
                                        <DatePicker disabled={disabled} />
                                    )}
                                    </FormItem>
                                </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                            <FormItem label='任务执行情况' {...firstLayout}  >
                                {getFieldDecorator('taskDesc',{
                                 rules: [{ required: true, message: '请输入任务执行情况' }],
                                rules: [{ max: 100, message: '任务执行情况长度不超过100' }],
                                initialValue:isInitialValue?commandDetail.taskDesc :""
                                })(
                                    <Input.TextArea placeholder="任务执行情况" onChange={(e) => {this.setState({taskDesc: e.target.value})}} disabled={disabled} autosize={{ minRows: 2, maxRows: 24 }} />
                                )}
                            </FormItem>
                        </Col>     
                    </Row>
                </div>
                <Row gutter={24}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='是否反馈' {...secondLayout}  >
                                {getFieldDecorator('isFeedback',{
                                initialValue:isInitialValue? commandDetail.isFeedback : ""
                                })(
                                    <Select disabled={disabled}>
                                        <Option value={""}>请选择反馈情况</Option>	
                                        <Option value={0}>否</Option>
                                        <Option value={1}>是</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>     
                    </Row>
                <Row gutter={24}>
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                            <FormItem label='反馈内容' {...firstLayout}  >
                                {getFieldDecorator('feedbackContent',{
                                initialValue:isInitialValue?commandDetail.feedbackContent :""
                                })(
                                    <Input.TextArea placeholder="反馈内容" onChange={(e) => {this.setState({feedbackContent: e.target.value})}} disabled={disabled} autosize={{ minRows: 2, maxRows: 24 }} />
                                )}
                            </FormItem>
                        </Col>     
                    </Row>
                    <Row gutter={24}>
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                            <FormItem label='备注' {...firstLayout}  >
                                {getFieldDecorator('remark',{
                                initialValue:isInitialValue?commandDetail.remark :""
                                })(
                                    <Input.TextArea placeholder="备注" onChange={(e) => {this.setState({remark: e.target.value})}} disabled={disabled} autosize={{ minRows: 2, maxRows: 24 }} />
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
        {peoVisible ? <PeoModal
          visible={peoVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleAdd.bind(this)}
          targetKeys={targetKeys}
        /> : null}
        </div>
    }

}

const AddViewForm = Form.create()(CommandEdit);

const mapStateToProps = state => ({
  loginState: state.login
})
export default connect(
  mapStateToProps
)(AddViewForm)


// WEBPACK FOOTER //
// ./src/components/admin/reportManage/Command/CommandEdit.js