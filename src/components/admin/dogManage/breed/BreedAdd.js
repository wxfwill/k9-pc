import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message,Tag,Card,Collapse,Row,Col,Select,DatePicker,Form,Input,Tooltip } from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import { firstLayout,secondLayout} from 'components/view/common/Layout';
import moment from 'moment';
import 'style/view/common/detailTable.less';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;

class AddPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {           
            maleDogs: [],
            femaleDogs: [],
        }
    }
    componentDidMount(){
    const sexId0 = httpAjax('post', config.apiUrl+'/api/dog/getAncestorInfo',{sexId: 0}); // 母
    const sexId1 = httpAjax('post', config.apiUrl+'/api/dog/getAncestorInfo',{sexId: 1});
    Promise.all([sexId0, sexId1]).then((res) => {
        this.setState({
            maleDogs: res[0].data,
            femaleDogs: res[1].data,
        })
    })
    }
    checkMaleChlNumber = (rule, value, callback) => {
        const re = /^\+?[1-9][0-9]*$/;
        if (re.test(value)) {
            if(value>100){
                callback('正整数且不超过100');
            }else{
                callback();
            }
        }else{
            if(value==''){
                callback();
            }else{
                callback('正整数且不超过100');
            }
          
        }
    }

  
    
    handleSubmit=(type) => {
        const breed = this.props.location.pathname.indexOf('breed')>0;

        let id;
        if(this.props.location.query&&this.props.location.query.editItem) {
            id = `${this.props.location.query.editItem.id}`;
        }
        this.props.form.validateFields((err,values)=> {
            if(!err) {
                if(values.maleChlNumber+values.femaleChlNumber<=0){
                    message.info('公母犬仔总数不能为小于0！');
                    return;
                }
                console.log(values);
                let params = {};
                if(breed) {
                    params = {
                        ...values,
                        breedTime: values.breedTime.format('x'),
                        estrusTime: values.estrusTime.format('x'),
                    }
                } else {
                    params = {
                        ...values,
                        birthday: values.birthday.format('x'),
                    }
                }
                if(id) {
                    params.id = id
                }
                console.log(params);
                httpAjax('post',config.apiUrl+`/api/breed/${breed?'saveBreedRecord':'saveReproduce'}`, params).then((res) => {
                    if(res.code == 0) {
                        this.props.history.push(`/app/dog/${breed?'breed':'reproduce'}`);
                        message.info('保存成功！')
                    } else {
                        message.error('保存失败！')
                    }
                 })
            }
        })
    }

    render() {
        console.log(this.state)
        const breed = this.props.location.pathname.indexOf('breed')>0;

        const { maleDogs, femaleDogs } = this.state;
        const { getFieldDecorator  } = this.props.form;
        let editItem;
        if(this.props.location.query) {
            editItem = this.props.location.query.editItem;
        }
        return(
            <Row gutter={24}>
		            <Col span={24}>
			          	<Card title={`${breed?'新增配种信息':'新增繁殖记录'}`} bordered={true}>
			          		<Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
			          			<Form className="ant-advanced-search-form">
                                  <Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='公犬' {...secondLayout}>
                                                {getFieldDecorator('femaleDogId',{
                                                rules: [{ required: true, message: '请选择公犬' }],
                                                initialValue:editItem?editItem.femaleDogId:""
                                                })(
                                                    <Select placeholder="请选择公犬"  
                                                        optionLabelProp="children" 
                                                        showSearch autosize={{ minRows: 2, maxRows: 24 }}
                                                        // onChange={(a,b,c) => {console.log(a,b,c)}}
                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                        {femaleDogs.map((item) => <Option value={item.id} key={item.id+'_female'}>{`${item.name} ${item.chipCode&&`(${item.chipCode})`}`}</Option>)}
                                                    </Select>
                                                )}
                                            </FormItem>
							            </Col>       
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='母犬' {...secondLayout}  >
                                                {getFieldDecorator('maleDogId',{
                                                rules: [{ required: true, message: '请选择母犬' }],
                                                initialValue:editItem?editItem.maleDogId+'':""
                                                })(
                                                    <Select placeholder="请选择母犬"  
                                                        optionLabelProp="children" 
                                                        showSearch autosize={{ minRows: 2, maxRows: 24 }}
                                                        // onChange={(a,b,c) => {console.log(a,b,c)}}
                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                        {maleDogs.map((item) => <Option value={item.id+''} key={item.id+'_male'}>{`${item.name} ${item.chipCode&&`(${item.chipCode})`}`}</Option>)}
                                                    </Select>
                                                )}
                                            </FormItem>
							            </Col>   
                                    </Row>
                                    {
                                        breed? <Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='配种时间' {...secondLayout}  >
                                                {getFieldDecorator('breedTime',{
                                                rules: [{ required: true, message: '请选择配种时间' }],
                                                initialValue:editItem?moment(editItem.breedTime):""
                                                })(
                                                    <DatePicker  />
                                                )}
                                            </FormItem>
							            </Col>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='发情时间' {...secondLayout}>
                                                {getFieldDecorator('estrusTime',{
                                                rules: [{ required: true, message: '请选择发情时间' }],
                                                initialValue:editItem?moment(editItem.estrusTime):""
                                                })(
                                                    <DatePicker  />
                                                )}
                                            </FormItem>
							            </Col> 
                                    </Row> : <Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='出生日期：' {...secondLayout}  >
                                                {getFieldDecorator('birthday',{
                                                rules: [{ required: true, message: '请选择出生日期' }],
                                                initialValue:editItem?moment(editItem.birthday):""
                                                })(
                                                    <DatePicker  />
                                                )}
                                            </FormItem>
							            </Col>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='繁衍期：' {...secondLayout}>
                                                {getFieldDecorator('period',{
                                                rules: [{ required: true, message: '请填写繁衍期' }],
                                                initialValue:editItem?editItem.period:""
                                                })(
                                                    <Input placeholder="请填写繁衍期"  />
                                                )}
                                            </FormItem>
							            </Col> 
                                    </Row>
                                    }
                                    
			            			{
                                        breed? <Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='配种地点' {...secondLayout}  >
                                                {getFieldDecorator('place',{
                                                rules: [{ required: true, message: '请输入配种地点' },{message: '地点长度不超过20',max:20 }],
                                                initialValue:editItem?editItem.place:""
                                                })(
                                                    <Input placeholder="请输入配种地点" autosize={{ minRows: 2, maxRows: 24 }} />
                                                )}
                                            </FormItem>
							            </Col>
                                        
                                    </Row> :  <Row gutter={24}>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='产仔母犬数：' {...secondLayout}  >
                                                {getFieldDecorator('maleChlNumber',{
                                                rules: [{ required: true, message: '请输入产仔公犬数' },{ validator: this.checkMaleChlNumber }],
                                                initialValue:editItem?editItem.maleChlNumber:""
                                                })(
                                                    <Input placeholder="请输入产仔公犬数" autosize={{ minRows: 2, maxRows: 24 }} />
                                                )}
                                            </FormItem>
							            </Col>
                                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                                            <FormItem label='产仔公犬数：' {...secondLayout}  >
                                                {getFieldDecorator('femaleChlNumber',{
                                                rules: [{ required: true, message: '请输入产仔母犬数'},{ validator: this.checkMaleChlNumber }],
                                                initialValue:editItem?editItem.femaleChlNumber:""
                                                })(
                                                    <Input placeholder="请输入产仔母犬数"  autosize={{ minRows: 2, maxRows: 24 }} />
                                                )}
                                            </FormItem>
							            </Col>
                                        
                                    </Row>
                                    }	                    					            						            						            						            						            						            						            						            						            						            	
                                   
                                    <Row>
                                        <Col span={24} style={{ textAlign: 'center',marginTop:'40px' }}>
                                        <Button type="primary" htmlType='submit' onClick={() => this.handleSubmit('publish')}>保存</Button>
                                        {/* <Button style={{ marginLeft: 8 }} onClick={() => this.handleSubmit('save')}>保存</Button> */}
                                        </Col>
                                    </Row> 
				                    
								</Form>
			          		</Col>		
			          	</Card>
		            </Col>
	        	</Row>)
    }
}

export default Form.create()(AddPlan);


// WEBPACK FOOTER //
// ./src/components/admin/dogManage/breed/BreedAdd.js