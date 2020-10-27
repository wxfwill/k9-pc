import React from 'react';
import { connect } from 'react-redux';
import {Row,Col,Card,Form,Input,Icon,Radio,DatePicker ,Button,Select,Upload,message,Modal } from 'antd';
import { firstLayout,secondLayout} from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
import {regExp} from 'libs/util/index';
import moment from 'moment';
const FormItem=Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
require('style/app/dogInfo/addDogForm.less');
class  FormCompomnent extends React.Component{
	constructor(props){
		super(props);
		this.state={
			fileList:[],
			imageUrl:'',
			userId:'',
			disabled:false,
			isInitialValue:false,
			userInfor:'',
			previewVisible: false,
			previewImage: '',
			showImgUrl:''
		}
	}
	componentWillMount(){		
		//工作单位
		httpAjax("post",config.apiUrl+'/api/basicData/workUnitList',{}).then(res=>{
			if(res.code==0){
				this.setState({workUnitList:res.data})
			}
		})
		//角色
		httpAjax("post",config.apiUrl+'/api/userCenter/roles',{}).then(res=>{
			if(res.code==0){
				this.setState({roleList:res.data})
			}
		})	
		//所属中队
		httpAjax("post",config.apiUrl+'/api/basicData/userGroup',{}).then(res=>{
			if(res.code==0){
				this.setState({groupList:res.data})
			}
		})	
		const formStatus=sessionStorage.getItem("formStatus")  //this.props.location.query&&this.props.location.query.targetText;
		const userId=sessionStorage.getItem("singleUserId");  //this.props.location.query&&this.props.location.query.dogId;
		const dutyList=JSON.parse(sessionStorage.getItem("dutyList"));
		this.setState({userId,dutyList});
		this.setState({userId,dutyList});
		if(formStatus=='view'){			
			this.setState({disabled:true,isInitialValue:true})
		}else if(formStatus=='edit'){
			this.setState({isInitialValue:true})			
		}else if(formStatus=='add'){
			this.setState({isInitialValue:false})
		}
		//根据id获取单个警员数据
		if(userId){
			httpAjax('post',config.apiUrl+'/api/user/info',{id:userId}).then(res=>{
				if(res.code==0){
					this.setState({userInfor:res.data});
				}
			})			
		}
	}
	handleCancel = () => this.setState({ previewVisible: false })
	handlePreview=(params)=>{
	    this.setState({
	      previewVisible: true
	    });
  	}
	handleChange = (fileList) => {
		this.setState({ fileList })
	}
 	beforeUpload(file) {
 		let _this = this;
 		let url = window.URL.createObjectURL(file); 
	  	const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
		    message.error('Image must smaller than 2MB!');
		    return false;
		}
		if(isLt2M){
	  		this.setState(({ fileList }) => ({
	        	fileList: [...fileList, file],
	        	previewImage:url,
	    	}));
		}
		let  promise= new Promise(function(resolve, reject) {
			if (isLt2M){
			    // resolve(_this.state.fileList);
			} else {
			    reject(error);
			}
		});
		return promise;
	}
	handleClear=()=>{
		this.setState({fileList:[],previewImage:''});
	}
	//检查警员编号是否重复
	checkNumber=(rule, value, callback)=>{
		const numberValue=this.props.form.getFieldValue("number");
		const {userInfor,isInitialValue}=this.state;
		let param = new FormData();
		const userNumber=userInfor&&userInfor.number;	
		let configs = {
		        	headers: {'Content-Type': 'multipart/form-data'}
		    }
		param.append("number",value);
		const re = /^[A-Za-z\d]{1,20}$/;
		if (re.test(value)) {
			httpAjax('post',config.apiUrl+'/api/user/isNotExistence',param,configs).then(res=>{
				if(!res.data&&(userNumber!=value)){
					callback('警员编号重复');
				}else{
					callback();
				}
		   })			
		} else {
			if(value==''){
				callback();
			}else{
				callback('警员编号不能为空且长度不超过20的数字或字母')
			}
		}	
	}
	handleSubmit=(e)=>{
		e.preventDefault();
		const { userId ,fileList,userInfor}=this.state;
		const { id } = JSON.parse(sessionStorage.getItem('user'));
		const successMess = userId ?'修改成功' : '添加成功';
		const errorMess = userId ?'修改失败' : '添加失败';
		this.props.form.validateFields((err,values)=>{
			if(!err){
				const options = values;
				let param = new FormData()  // 创建form对象
				if(options.birthday){
					options.birthday = moment(new Date(values.birthday)).format('YYYY-MM-DD');
				}				
				Object.keys(options).forEach((item,index)=>{
					if(options[item]!=undefined||options[item]!=''){
						param.append(item,options[item]);
					}					
				})
				if(fileList&&userInfor.photo){
					param.append('photoFile',fileList.pop());
					param.append('imgOperation',1);
				}else{
					param.append('photoFile',fileList.pop());
					param.append('imgOperation',0);
				}
		      	let configs = {
		        	headers: {'Content-Type': 'multipart/form-data'}
		     	}
		     	if(userId){
		     		param.append("id",userId);
		     	}
				 param.append("userId",id);
		      	httpAjax('post',config.apiUrl+'/api/user/saveInfo',param,configs).then((res)=>{
		      		if(res.code==0){
						this.props.history.push('/app/user/info');
		      			message.success(successMess)
		      			//window.location.href=config.apiUrl+"#/app/user/info";
		      		}else{
		      			message.error(errorMess)
		      		}
		      	}).catch((error)=>{
		      		console.log(error)
		      	})
			}
		})
	}
	render(){
		const {getFieldDecorator}=this.props.form;
		const {showImgUrl,previewVisible,previewImage,fileList,imageUrl,disabled,isInitialValue,userInfor,workUnitList,dutyList,userId,roleList,groupList}=this.state;
    	const uploadButton = (
	 		<div>
		        <Icon type={this.state.loading ? 'loading' : 'plus'} />
		        <div className="ant-upload-text">上传图片</div>
	      	</div>
	    )
	    const  workUnitOption=workUnitList&&workUnitList.map((item,index)=>{
	    	return <Option  value={item.id} key={index}>{item.name}</Option>
	    })	
	    const  dutyOption=dutyList&&dutyList.map((item,index)=>{
	    	return <Option  value={item.id} key={index}>{item.name}</Option>
		})  
		const  roleOption=roleList&&roleList.map((item,index)=>{
	    	return <Option  value={item.id} key={index}>{item.description}</Option>
		})    
		const  groupOption=groupList&&groupList.map((item,index)=>{
	    	return <Option  value={item.id} key={index}>{item.name}</Option>
		})  	
		return(
			<div className="AddDogForm">
	        	<Row gutter={24}>
		            <Col span={24}>
			          	<Card title='警员信息' bordered={true}>
			          		<Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
			          			<Form className="ant-advanced-search-form">
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='姓名' {...secondLayout}  >
								               {getFieldDecorator('name',{
								               	rules: [{ required: true, message: '请输入姓名' },{ max: 10, message: '姓名长度不超过10' }],
								               	initialValue:isInitialValue? userInfor.name ? userInfor.name :"" :""
								               })(
								                  <Input placeholder="警员姓名"   disabled={disabled}/>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
							              <FormItem label='身份证' {...secondLayout} >
							               {getFieldDecorator('identityNo',{
							               	//rules:[{required:true,message:'请输入犬只名称'}],
											rules:[{pattern:'(^[0-9]{15}$)|(^[0-9]{18}$)|(^[0-9]{17}([0-9]|X|x)$)',message:'身份证输入不合法'}],
							               	initialValue:isInitialValue?userInfor.identityNo? userInfor.identityNo :"" : ""
							               })(
							               		<Input placeholder="身份证"  disabled={disabled}/>
							                )}
							              </FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='性别' {...secondLayout}  >
								               {getFieldDecorator('sex',{
								               	//rules: [{ required: true, message: '请选择性别' }],
								               	initialValue:isInitialValue?(userInfor.sex==1||userInfor.sex==0)?userInfor.sex :"":1
								               })(
								                  <RadioGroup disabled={disabled}>
								                  	<Radio value={1}>男</Radio>
        											<Radio value={0}>女</Radio>
								                  </RadioGroup>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
							              <FormItem label='出生日期' {...secondLayout} >
							               {getFieldDecorator('birthday',{
							               	//rules:[{required:true,message:'请选择出生日期'}],
							               	initialValue:isInitialValue?userInfor.birthday ?(userInfor.birthday&&moment(new Date(userInfor.birthday))) :'':''
							               })(
							               		<DatePicker disabled={disabled} />
							                )}
							              </FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='民族' {...secondLayout}  >
								               {getFieldDecorator('nation',{
								               	//rules: [{ required: true, message: '请输入民族' }],
												rules: [{ max: 10, message: '民族长度不超过10' }],
								               	initialValue:isInitialValue?userInfor.nation ? userInfor.nation :"" :""
								               })(
								                  <Input placeholder="民族" disabled={disabled}/>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
							              <FormItem label='籍贯' {...secondLayout} >
							               {getFieldDecorator('birthplace',{
							               	//rules:[{required:true,message:'请输入籍贯'}],
											rules: [{ max: 25, message: '籍贯长度不超过25' }],
							               	initialValue:isInitialValue?userInfor.birthplace ? userInfor.birthplace :"":""
							               })(
							               		<Input placeholder="籍贯" disabled={disabled}/>
							                )}
							              </FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='政治面貌' {...secondLayout}  >
								               {getFieldDecorator('politicsStatus',{
								               	//rules: [{ required: true, message: '请选择政治面貌' }],
								               	initialValue:isInitialValue ? userInfor.politicsStatus ? userInfor.politicsStatus :"" :""
								               })(
								                  <Select disabled={disabled}>
												 	<Option value={""}>请选择政治面貌</Option>	
								                  	<Option value={1}>群众</Option>
								                  	<Option value={2}>团员</Option>
								                  	<Option value={3}>党员</Option>
								                  </Select>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
							              <FormItem label='毕业院校' {...secondLayout} >
							               {getFieldDecorator('university',{
							               	//rules:[{required:true,message:'请输入毕业院校'}],
											rules: [{ max: 25, message: '籍贯长度不超过25' }],
							               	initialValue:isInitialValue ? userInfor.university ? userInfor.university :"":""
							               })(
							               		<Input placeholder="毕业院校" disabled={disabled}/>
							                )}
							              </FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='身份类别' {...secondLayout} >
								               {getFieldDecorator('dutyType',{
								               	//rules: [{ required: true, message: '请选择身份类别' }],
								               	initialValue:isInitialValue?userInfor.dutyType ? userInfor.dutyType :"":""
								               })(
								                  <Select disabled={disabled}>
												  	<Option value={""}>请选择身份类别</Option>	
								                  	<Option value={"1"}>民警</Option>
								                  	<Option value={"2"}>文职</Option>
								                  	<Option value={"3"}>边消警</Option>
								                  	<Option value={"4"}>其他辅助人员</Option>
								                  </Select>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
							              <FormItem label='学历' {...secondLayout} >
							               {getFieldDecorator('degree',{
							               	//rules:[{required:true,message:'请选择学历'}],
							               	initialValue:isInitialValue?userInfor.degree ? userInfor.degree :"":""
							               })(
								                  <Select disabled={disabled}>
												  	<Option value={""}>请选择学历</Option>	
								                  	<Option value={1}>大专</Option>
								                  	<Option value={2}>本科</Option>
								                  	<Option value={3}>硕士</Option>
								                  	<Option value={4}>博士</Option>
								                  </Select>
							                )}
							              </FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='是否在职' {...secondLayout}  >
								               {getFieldDecorator('incumbent',{
								               	//rules: [{ required: true, message: '是否在职' }],
								               	initialValue:isInitialValue?(userInfor.incumbent==1||userInfor.incumbent==0)? userInfor.incumbent :"":1
								               })(
								                  <RadioGroup disabled={disabled}>
								                  	<Radio value={0}>离职</Radio>
        											<Radio value={1}>在职</Radio>
								                  </RadioGroup>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
							              <FormItem label='专业' {...secondLayout} >
							               {getFieldDecorator('major',{
							               	//rules:[{required:true,message:'请选择专业'}],
							               	initialValue:isInitialValue?userInfor.major ? userInfor.major :"":""
							               })(
								                  <Select disabled={disabled}>
													<Option value={""}>请选择专业</Option>	
								                  	<Option value={1}>公安警犬技术类专业</Option>
								                  	<Option value={2}>公安类专业</Option>
								                  	<Option value={3}>农科类专业</Option>
								                  	<Option value={4}>理科类专业</Option>
								                  	<Option value={5}>文科类专业</Option>
								                  </Select>
							                )}
							              </FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='职务' {...secondLayout}  >
								               {getFieldDecorator('duty',{
								               	//rules: [{ required: true, message: '请选择职务' }],
								               	initialValue:isInitialValue?userInfor.duty ? userInfor.duty :"":""
								               })(
								                  <Select disabled={disabled}>
												  	<Option value={""}>请选择职务</Option>	
								                  	{dutyOption}
								                  </Select>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='资格证书' {...secondLayout}  >
								               {getFieldDecorator('credentials',{
								               	//rules: [{ required: true, message: '请选择资格证书' }],
								               	initialValue:isInitialValue?userInfor.credentials ? userInfor.credentials :"":""
								               })(
								                  <Select disabled={disabled}>
												 	<Option value={""}>请选择资格证书</Option>	
								                  	<Option value={1}>警犬训练一级</Option>
								                  	<Option value={2}>警犬训练二级</Option>
								                  	<Option value={3}>警犬训练三级</Option>
								                  	<Option value={4}>警犬训练四级</Option>
								                  </Select>
								                )}
							              	</FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='职称' {...secondLayout}  >
								               {getFieldDecorator('title',{
								               	//rules: [{ required: true, message: '请选择职称' }],
								               	initialValue:isInitialValue?userInfor.title ? userInfor.title :"":""
								               })(
								                  <Select disabled={disabled}>
												  	<Option value={""}>请选择职称</Option>	
								                  	<Option value={1}>高级工程师</Option>
								                  	<Option value={2}>工程师</Option>
								                  	<Option value={3}>助理工程师</Option>
								                  </Select>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='证书编号' {...secondLayout}  >
								               {getFieldDecorator('certificateNo',{
								               	//rules: [{ required: true, message: '请填写证书编号' }],
												rules: [{ pattern: '^[A-Za-z0-9]{1,20}$', message: '证书编号长度不超过20的数字或字母'}],
								               	initialValue:isInitialValue?userInfor.certificateNo ? userInfor.certificateNo :"":""
								               })(
								                  <Input placeholder="证书编号" disabled={disabled}/>
								                )}
							              	</FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='工作单位' {...secondLayout}  >
								               {getFieldDecorator('unitId',{
								               	//rules: [{ required: true, message: '请选择工作单位' }],
								               	initialValue:isInitialValue?userInfor.unitId ? userInfor.unitId :"":""
								               })(
								                  <Select disabled={disabled}>
												  	<Option value={""}>请选择工作单位</Option>	
								                  	{workUnitOption}
								                  </Select>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='电话' {...secondLayout} >
								               {getFieldDecorator('telphone',{
								               	//rules: [{ required: true, message: '请填写电话号码' },{pattern:regExp.telphone,message:'请输入正确的手机号码格式'}],
												   rules: [{ pattern: '(([0-9]{11})|^(([0-9]{7,8})|([0-9]{4}|[0-9]{3})-([0-9]{7,8})|([0-9]{4}|[0-9]{3})-([0-9]{7,8})-([0-9]{4}|[0-9]{3}|[0-9]{2}|[0-9]{1})|([0-9]{7,8})-([0-9]{4}|[0-9]{3}|[0-9]{2}|[0-9]{1}))$)', message: '请输入正确的手机号码格式'}],
								               	initialValue:isInitialValue?userInfor.telphone ? userInfor.telphone :"":""
								               })(
								                  <Input placeholder="电话号码" disabled={disabled}/>
								                )}
							              	</FormItem>
							            </Col>
					            	</Row>
							      	<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										    <FormItem label='警员编号' {...secondLayout} >
								               {getFieldDecorator('number',{
								               	rules: [{ required: true,whitespace:true, message: '请填写警员编号' },{validator: this.checkNumber}],
								               	initialValue:isInitialValue ? userInfor.number ? userInfor.number :"":""
								               })(
								                  <Input placeholder="警员编号" disabled={disabled} />
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
										    <FormItem label='所属中队' {...secondLayout} >
								               {getFieldDecorator('groupId',{
								               	//rules: [{ required: true, message: '请选择所属中队' }],
								               	initialValue:isInitialValue ? userInfor.groupId ? userInfor.groupId :"":""
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
							              <FormItem label='角色' {...secondLayout} >
							               {getFieldDecorator('role',{
											rules: [{ required: true, message: '请选择角色' }],
							               	initialValue:isInitialValue?userInfor.role ? userInfor.role :"":""
							               })(
								                  <Select disabled={disabled}>
													<Option value={""}>请选择角色</Option>	
								                  	{roleOption}
								                  </Select>
							                )}
							              </FormItem>
							            </Col>
										</Row>
				                    <FormItem label='个人履历' {...firstLayout} >
				                     {getFieldDecorator('remark',{
				                        //rules: [{ required: true, message: '请输入个人履历' }],
										rules: [{ max: 500, message: '个人履历长度不超过500' }],
				                        initialValue:isInitialValue ? userInfor.remark ? userInfor.remark :"":""
				                      })(
				                        <TextArea placeholder="个人履历" autosize={{ minRows: 3, maxRows: 6 }} disabled={disabled}/>
				                      )}
				                    </FormItem>				            						            						            	  			                    
				                    <FormItem label='警员图片' {...firstLayout}  >
										<Upload 
											className='imageContent'
											name="photoFile"
											action={config.apiUrl+'/api/user/saveInfo'}
											disabled={disabled} 
											accept="image/*"
											listType="picture-card"
											onChange={this.handleChange.bind(this)}
											beforeUpload={this.beforeUpload.bind(this)} >
											{isInitialValue  && userInfor.photo
												? (fileList.length ==0 ?<img src={config.apiUrl+`/api/user/img?id=${userId}&t=${new Date().getTime()}`} style={{ width: '100px',height:'100px' }} alt=""  />:uploadButton ): uploadButton
											}
{/*											{fileList.length <1 ? uploadButton : <img src={config.apiUrl+`/api/dog/img?id=${dogId}`} style={{ width: '100px',height:'100px' }}alt=""  />}												
*/}										</Upload>
								        {previewImage ?
								          	<div className="pre-container">
								          		<img src={previewImage} style={{ width: '100px',height:'100px' }}alt="" onClick={()=>this.handlePreview()}/> 
								          		<Icon type="close-circle-o" className="clear" onClick={()=>this.handleClear()} />
								          	</div>
								          	: null
							          	}
								       	<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
								          <img alt="example" style={{ width: '100%' }} src={previewImage} />
								        </Modal>
				                    </FormItem>

				                    {
				                    	!disabled ?
						                    <Row>
						                      <Col span={24} style={{ textAlign: 'center',marginTop:'40px' }}>
						                        <Button type="primary" htmlType='submit' onClick={this.handleSubmit.bind(this)}>提交</Button>
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
		)
	}
}
const AddUserForm = Form.create()(FormCompomnent);

const mapStateToProps = state => ({
  loginState: state.login
})
export default connect(
  mapStateToProps
)(AddUserForm)


// WEBPACK FOOTER //
// ./src/components/admin/userInfor/addUserForm.js