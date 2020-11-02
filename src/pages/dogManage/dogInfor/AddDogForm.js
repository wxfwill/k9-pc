import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload, message, Modal, AutoComplete, Divider, Tag } from 'antd';
import { firstLayout, secondLayout } from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const AutoOption = AutoComplete.Option;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
require('style/app/dogInfo/addDogForm.less');
function onSelect(value) {
	console.log('onSelect', value);
}

class FormCompomnent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fileList: [],
			reportFilelist: [],
			imageUrl: '',
			dogId: '',
			disabled: false,
			isInitialValue: true,
			dogInfor: '',
			dogBreeds: [],
			dogColor: [],
			previewVisible: false,
			previewImage: '',
			showImgUrl: '',
			rfidNo: '',
			braceletId: '',
			roomId: '',
			roomIdName: '选择犬舍',
			fatherId: '',// 父亲id
			fatherName: '',
			motherId: '', // 母亲 id
			motherName: '', // 母亲 
			parentIdVisible: false,// 直系亲属模态窗
			parentSelectType: 1,// 当前父母数据源类型
			fatherSource: [],// 取回所有父犬
			motherSource: [],// 取回所有母犬
			roomIdvisible: false,
			allHouseData: [],
			dogList: [],
			allBracelet: [],
			jobUsageList: [],
			trainerList: [],
			lastestUploadImg: config.apiUrl + `/api/dog/img?id=${sessionStorage.getItem("dogId")}&t=${new Date().getTime()}`
		}
	}

	componentWillMount() {
		//获取犬只毛色数据
		this.getTrainer();
		this.getAllBraceletInfo()
		httpAjax('post', config.apiUrl + '/api/basicData/furColor', {}).then(res => {
			if (res.code == 0) {
				this.setState({ dogColor: res.data });
			}
		})
		const formStatus = sessionStorage.getItem("formStatus")  //this.props.location.query&&this.props.location.query.targetText;
		const dogId = sessionStorage.getItem("dogId");  //this.props.location.query&&this.props.location.query.dogId;
		const dogBreeds = JSON.parse(sessionStorage.getItem("dogBreeds"));
		const workUnitList = JSON.parse(sessionStorage.getItem("workUnitList"));
		this.setState({ dogId, dogBreeds, workUnitList });
		if (formStatus == 'view') {
			this.setState({ disabled: true, isInitialValue: true })
		} else if (formStatus == 'edit') {
			this.setState({ isInitialValue: true })
		} else if (formStatus == 'add') {
			this.setState({ isInitialValue: false })
		}
		//根据id获取单个犬只数据
		if (dogId) {
			httpAjax('post', config.apiUrl + '/api/dog/info', { id: dogId }).then(res => {
				if (res.code == 0) {
					this.setState({ dogInfor: res.data, ...res.data });
					this.selectHouseId(res.data.houseId||1)
					if( res.data.medicalReportName == 'none') {
						this.setState({reportFilelist:[]})
					} else {
						this.setState({
							reportFilelist: [{
								uid: -1,
								name: res.data.medicalReportName,
								status: 'done',
								url: config.apiUrl+'/api/dog/dlmedicalReport?id='+res.data.id,
							}]
						})
					}
					if( res.data.photo == 'none') {
						this.setState({fileList:[]})
					} else {
						this.setState({
							fileList: [{
								uid: -1,
								name: res.data.photo,
								status: 'done',
								url: this.state.lastestUploadImg
							}]
						})
					}
					
				}
			})
		}

		// 获取父犬list
		httpAjax('post', config.apiUrl + '/api/dog/getAncestorInfo', { sexId: 1 }).then(res => {
			if (res.code == 0) {
				sessionStorage.setItem("fatherSource", JSON.stringify(res.data));
				this.setState({ fatherSource: res.data });
			}
		})
		// 获取母犬list
		httpAjax('post', config.apiUrl + '/api/dog/getAncestorInfo', { sexId: 0 }).then(res => {
			if (res.code == 0) {
				sessionStorage.setItem("motherSource", JSON.stringify(res.data));
				this.setState({ motherSource: res.data });
			}
		})
		// 
		this.getJobUsage()
	}
	handleCancel = () => this.setState({ previewVisible: false })
	handlePreview = (params) => {
		this.setState({
			previewVisible: true
		});
	}
	handleChange = (fileList) => {
		this.setState({ fileList, lastestUploadImg: '' })
	}
	handleChangeHe = (fileList) => {
		this.setState({ heFileList:fileList, lastestUploadImg: '' })
	}
	beforeUpload(file) {
		this.setState({ lastestUploadImg: '' })
		let _this = this;
		let url = window.URL.createObjectURL(file);
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
			return false;
		}
		if (isLt2M) {
			this.setState(({ fileList }) => ({
				fileList: [ file],
				previewImage: url,
			}));
		}
		let promise = new Promise(function (resolve, reject) {
			if (isLt2M) {
				// resolve(_this.state.fileList);
			} else {
				reject(error);
			}
		});
		return promise;
	}
	handleClear = () => {
		this.setState({ fileList: [], previewImage: '' });
	}
	//检查犬只编号是否重复
	checkNumber = (rule, value, callback) => {
		console.log(value);
		console.log(value.length);
		const { dogInfor, isInitialValue } = this.state;
		const numberValue = this.props.form.getFieldValue("number");
		const dogNumber = dogInfor && dogInfor.number;
		const re =/^[A-Za-z\d]{1,20}$/;
		if (re.test(value)) {
			this.httpAjaxHadnle("number", value, res => {
				if (rule.field == 'number') {
					if (!res.data && (dogNumber != value)) {
						callback('该档案编号已存在');
					} else {
						callback();
					}
				}
			});
		}else {
			if(value==''){
				callback()
			}else{
				callback('档案编号不能为空且长度不超过20的数字或字母')
			}
			
		}
	}
	// 校验芯片号格式和是否重复
	checkChipCode = (rule, value, callback) => {
		const { dogInfor, isInitialValue } = this.state;
		const chipCode = this.props.form.getFieldValue("chipCode");
		const initChipCode = dogInfor && dogInfor.chipCode;
		/* 格式：长度为16位的数字和字母组合 */
		const re = /^[A-Za-z\d]{1,20}$/;
		if (re.test(value)) {
			this.httpAjaxHadnle("chipCode", value, res => {
				if (rule.field == 'chipCode') {
					if (!res.data && (initChipCode != value)) {
						callback('犬只芯片号重复');
					} else {
						callback();
					}
				}
			});
		} else {
			if(value==''){
				callback()
			}else{
				callback('档案编号不能为空且长度不超过20的数字或字母')
			}
		}
	}

	checkName = (rule, value, callback) => {
		console.log(value);
		if(value.length>10){
			callback('长度限制不超过10个中文');
		}else{
			callback();
		}
	}

	checkAppearance = (rule, value, callback) => {
		if(value.length>50){
			callback('长度限制不超过50个中文');
		}else{
			callback();
		}
	}

	checkBreedUnit = (rule, value, callback) => {
		if(value.length>25){
			callback('长度限制不超过25个中文');
		}else{
			callback();
		}
	}
	
	checkRemark = (rule, value, callback) => {
		if(value.length>500){
			callback('长度限制不超过500个中文');
		}else{
			callback();
		}
	}
	// 请求后台验证
	httpAjaxHadnle = (key, value, callback) => {
		let param = new FormData(),
			configs = { headers: { 'Content-Type': 'multipart/form-data' } };
		param.append(key, value);
		httpAjax('post', config.apiUrl + '/api/dog/isNotExistence', param, configs).then(callback);
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const { dogId, fileList, dogInfor, rfidNo, braceletId, roomId, fatherId, fatherName, motherId, motherName, reportFilelist } = this.state;
		const { id } = JSON.parse(sessionStorage.getItem('user'));
		const successMess = dogId ? '修改成功' : '添加成功';
		const errorMess = dogId ? '修改失败' : '添加失败';
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const options = values;
				let param = new FormData()  // 创建form对象
				if (options.birthday) {
					options.birthday = moment(new Date(values.birthday)).format('YYYY-MM');
				}
				Object.keys(options).forEach((item, index) => {
					if ((options[item] != undefined) || (options[item] != '') || (options[item] != null)) {
						param.append(item, options[item]);
					}
				})
				if (fileList.length >= 1 && dogInfor.photo !== 'none' && fileList[0].name == dogInfor.photo) {
					// param.append('photoFile', fileList.pop());
					param.append('imgOperation', 0);
				} else if (fileList.length >= 1 && dogInfor.photo == 'none') {
					param.append('photoFile',fileList.pop());
					param.append('imgOperation', 1);
				}else if (fileList.length >= 1 && dogInfor.photo !== 'none') {
					param.append('photoFile',fileList.pop());
					param.append('imgOperation', 1);
				}  else if (fileList.length == 0 && dogInfor.photo) {
					// param.append('photoFile',fileList.pop());
					param.append('imgOperation', 2);
				} else {
					//param.append('photoFile',fileList.pop());
					param.append('imgOperation', 0);
				}
				if (reportFilelist.length >= 1&& dogInfor.medicalReportName !== 'none' && dogInfor.medicalReportName == reportFilelist[0].name) {
					// param.append('reportFile', reportFilelist.pop());
					param.append('reportOperation', 0);
				} else if (reportFilelist.length >= 1 && dogInfor.medicalReportName) {
					param.append('reportFile', reportFilelist.pop());
					param.append('reportOperation', 1);
				} else if (reportFilelist.length == 0 && dogInfor.medicalReportName) {
					//param.append('reportFile', reportFilelist.pop());
					param.append('reportOperation', 2);
				} else {
					//param.append('photoFile',fileList.pop());
					param.append('reportOperation', 0);
				}

				let configs = {
					headers: { 'Content-Type': 'multipart/form-data' }
				}
				if (dogId) {
					param.append("id", dogId);
				}
				param.append("userId", id);
				param.append('rfidNo', rfidNo);
				param.append('braceletId', braceletId);
				param.append('roomId', roomId);
				// 新增“直属亲属”字段
				param.append('fatherId', fatherId);
				param.append('fatherName', fatherName);
				param.append('motherId', motherId);
				param.append('motherName', motherName);
				param.jobUsage = values.jobUsage.join(',')
				param.birthdayStr = values.birthdayStr? `${moment(values.birthdayStr).format('YYYY-MM')}` : '';
				param.houseId = values.houseId;
				httpAjax('post', config.apiUrl + '/api/dog/saveInfo', param, configs).then((res) => {
					if (res.code == 0) {
						message.success(successMess)
						this.props.history.push('/app/dog/info')
					} else {
						message.error(errorMess)
					}
				}).catch((error) => {
					console.log(error)
				})
			}
		})
	}
	getAllHouse = () => {
		this.setState({ roomIdvisible: true });
		httpAjax('post', config.apiUrl + '/api/dogRoom/allHouse').then((res) => {
			if (res.code == '0') {
				this.setState({ allHouseData: res.data })
				// this.selectHouseId(res.data[0].id);
			}
		})
	}
	// 直系亲属模态窗
	getParentIds = () => {
		this.setState({ parentIdVisible: true });
		httpAjax('post', config.apiUrl + '/api/dogRoom/allHouse').then((res) => {
			if (res.code == '0') {
				this.setState({ allHouseData: res.data })
				// this.selectHouseId(res.data[0].id);
			}
		})
	}
	// 切换父母数据源
	switchParentSource = (t) => {
		this.setState({ parentSelectType: t.target.value });
	}

	getAllBraceletInfo = () => {
		httpAjax('post', config.apiUrl + '/api/braceletInfo/listAll').then((res) => {
			if (res.code == '0') {
				this.setState({ allBracelet: res.data,
					 // braceletId: res.data[0] && res.data[0].id
					 })
			}
		})
	}
	// /api/basicData/jobUsage

	getJobUsage = () => {
		httpAjax('post', config.apiUrl + '/api/basicData/jobUsage').then((res) => {
			this.setState({
				jobUsageList: res.data,
			})
		});
	}
// /api/userCenter/getTrainer
	getTrainer = () => {
		httpAjax('post', config.apiUrl + '/api/userCenter/getTrainer', {name: ''}).then((res) => {
			this.setState({
				trainerList: res.data,
			})
		});
	}

	selectHouseId = (value) => {
		httpAjax('post', config.apiUrl + '/api/dogRoom/listRoomByHouse', { houseId: value, }).then((res) => {
			// if(res.code == '0') {
			this.setState({ dogList: res.data, roomIndex: 'qwe' })
			//	}
		})
	}

	handleSearch = (v) => {
		let types = this.state.parentSelectType,
			source = types ? sessionStorage.getItem("fatherSource") : sessionStorage.getItem("motherSource"),
			target = [];
		if (v) {
			// 匹配
			JSON.parse(source).map((item, i) => {
				if (item.name.indexOf(v) > -1) target.push(item)
			})
		} else {
			// 还原
			target = JSON.parse(source);
		}
		if (types) {
			this.setState({ fatherSource: target })
		} else {
			this.setState({ motherSource: target })
		}
	}
	// 选中所选父犬
	selectParent = (v) => {
		if (v && v.toString().indexOf('-') > -1) {
			let types = this.state.parentSelectType,
				tempArr = v.split('-');
			if (types) {
				this.setState({ fatherId: tempArr[1], fatherName: tempArr[0] })
			} else {
				this.setState({ motherId: tempArr[1], motherName: tempArr[0] })
			}
		}
	}
	render() {
		console.log(this.state)
		const { getFieldDecorator } = this.props.form;
		const { showImgUrl, previewVisible, previewImage, fileList, imageUrl, disabled, isInitialValue, dogInfor, dogBreeds, dogColor, workUnitList, dogId, allBracelet, braceletId } = this.state;
		const uploadButton = (
			<div>
				<Icon type={this.state.loading ? 'loading' : 'plus'} />
				<div className="ant-upload-text">上传图片</div>
			</div>
		)
		const dogBreedOption = dogBreeds && dogBreeds.map((item, index) => {
			return <Option value={item.id} key={index}>{item.name}</Option>
		})
		const colorOption = dogColor && dogColor.map((item, index) => {
			return <Option value={item.id} key={index}>{item.name}</Option>
		})
		const workUnitOption = workUnitList && workUnitList.map((item, index) => {
			return <Option value={item.id} key={index}>{item.name}</Option>
		})

		const { fatherSource, motherSource } = this.state;
		const fatherChildren = fatherSource.map((item, index) => {
			return <AutoOption key={item.id} value={item.name + '-' + item.id}>{item.name + '-' + item.id}</AutoOption>;
		});
		const motherChildren = motherSource.map((item, index) => {
			return <AutoOption key={item.id} value={item.name + '-' + item.id}>{item.name + '-' + item.id}</AutoOption>;
		});
		return (
			<div className="AddDogForm">
				<Row gutter={24}>
					<Col span={24}>
						<Card title='犬只信息' bordered={true}>
							<Col xxl={16} xl={22} lg={24} md={24} sm={24} xs={24}>
								<Form className="ant-advanced-search-form">
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='档案编号' {...secondLayout} hasFeedback>
												{getFieldDecorator('number', {
													rules: [{ validator: this.checkNumber }],
													initialValue: isInitialValue ? dogInfor.number : ""
												})(
													<Input placeholder="档案编号" disabled={disabled} />
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='犬只名称' {...secondLayout} >
												{getFieldDecorator('name', {
													//rules:[{required:true,message:'请输入犬只名称'}],
													rules: [{ validator: this.checkName }],
													initialValue: isInitialValue ? dogInfor.name : ""
												})(
													<Input placeholder="犬只名称" disabled={disabled} />
												)}
											</FormItem>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='性别' {...secondLayout}>
												{getFieldDecorator('sex', {
													//rules: [{ required: true, message: '请选择性别' }],
													initialValue: isInitialValue ? dogInfor.sex : ''
												})(
													<RadioGroup disabled={disabled}>
														<Radio value={0}>母</Radio>
														<Radio value={1}>公</Radio>
													</RadioGroup>
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='出生日期' {...secondLayout} >
												{getFieldDecorator('birthdayStr', {
													//rules:[{required:true,message:'请选择出生日期'}],
													initialValue: isInitialValue ? (dogInfor.birthday && moment(new Date(dogInfor.birthday))) : ""
												})(
													<MonthPicker disabled={disabled} format="YYYY-MM" />
												)}
											</FormItem>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='犬只品种' {...secondLayout} >
												{getFieldDecorator('breed', {
													//rules: [{ required: true, message: '请选择犬只品种' }],
													initialValue: isInitialValue ? dogInfor.breed : ''
												})(
													<Select disabled={disabled}>
														<Option value={""} >请选择犬只品种</Option>
														{dogBreedOption}
													</Select>
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='芯片号' {...secondLayout} >
												{getFieldDecorator('chipCode', {
													 rules: [{ required: true, whitespace: true, message: '请输入芯片号' },{ validator: this.checkChipCode }],
													initialValue: isInitialValue ? dogInfor.chipCode : ""
												})(
													<Input placeholder="芯片号" disabled={disabled} />
												)}
											</FormItem>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='犬只毛色' {...secondLayout} >
												{getFieldDecorator('color', {
													//rules: [{ required: true, message: '请选择犬只毛色' }],
													initialValue: isInitialValue ? dogInfor.color : ''
												})(
													<Select disabled={disabled}>
														<Option value={""} >请选择犬只毛色</Option>
														{colorOption}
													</Select>
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='犬只毛型' {...secondLayout} >
												{getFieldDecorator('woolType', {
													//rules:[{required:true,message:'请输入犬只毛型'}],
													initialValue: isInitialValue ? dogInfor.woolType : ''
												})(
													<Select disabled={disabled}>
														<Option value={""} >请选择犬只毛型</Option>
														<Option value={0}>短毛</Option>
														<Option value={1}>长毛</Option>
													</Select>
												)}
											</FormItem>
										</Col>
									</Row>
									<FormItem label='外貌特征' {...firstLayout} >
										{getFieldDecorator('appearance', {
											//rules: [{ required: true, message: '请输入外貌特征' }],
											rules: [{ validator: this.checkAppearance }],
											initialValue: isInitialValue ? dogInfor.appearance : ""
										})(
											<TextArea placeholder="外貌特征" autosize={{ minRows: 3, maxRows: 6 }} disabled={disabled} />
										)}
									</FormItem>

									<Row gutter={24}>
									{/*	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label="手环" {...secondLayout}>
												{
													//<Input  value={this.state.bluetoothAddr} onChange={(e) => {this.setState({bluetoothAddr: e.target.value})}} disabled={disabled}/>

												}
												{!disabled ? <Select disabled={disabled} value={braceletId} onChange={(value) => { this.setState({ braceletId: value }) }}>
													{
														allBracelet.map((item, index) => {
															return <Option value={item.id} key={item.id}>{item.name}</Option>
														})
													}
												</Select> : <Input value={this.state.braceletName} disabled={disabled} />
												}

											</FormItem>
										</Col>*/}
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='训导员' {...secondLayout} >
												{getFieldDecorator('trainerId', {
													//rules: [{ required: true, message: '请输入训导员' }],
													initialValue: isInitialValue ? dogInfor.trainerId ||'' : ""
												})(
													<Select>
														<Option value={""} >请选择训导员</Option>
														{ this.state.trainerList.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>) }
													</Select>
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label="犬舍" {...secondLayout} >
												<Button disabled={disabled} onClick={this.getAllHouse}>{this.state.roomName || this.state.roomIdName}</Button>
											</FormItem>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='工作犬类别' {...secondLayout}>
												{getFieldDecorator('jobUsage', {
													//rules: [{ required: true, message: '请选择身份类别' }],
													initialValue: isInitialValue ? dogInfor.jobUsage ?  dogInfor.jobUsage.split(',').map(t => Array(t))  :[] : []
												})(
													<Select disabled={disabled} mode="multiple">
														{ this.state.jobUsageList.map((item) => <Option value={item.id} key={item.id}>{item.name}</Option>) }
													</Select>
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											{/*<FormItem label="标签编号" {...secondLayout} >
												<Input value={this.state.rfidNo} onChange={(e) => { this.setState({ rfidNo: e.target.value }) }} disabled={disabled} />
											</FormItem>*/}
											<FormItem label="直系亲属" {...secondLayout} >
												<Button disabled={disabled} onClick={this.getParentIds}>{this.state.fatherId && this.state.fatherId.toString().length > 0 ? '父：' + (this.state.fatherName + '-' + this.state.fatherId) : '父：-'}，{this.state.motherId && this.state.motherId.toString().length > 0 ? '母：' + (this.state.motherName + '-' + this.state.motherId) : '母：-'}</Button>
											</FormItem>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='犬只类别' {...secondLayout} >
												{getFieldDecorator('type', {
													//rules: [{ required: true, message: '是否在职' }],
													initialValue: isInitialValue ? dogInfor.type : ""
												})(
													<Select disabled={true}>
														
													</Select>
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='训练等级' {...secondLayout} >
												{getFieldDecorator('trainingLevel', {
													//rules:[{required:true,message:'请选择专业'}],
													initialValue: isInitialValue ? dogInfor.trainingLevel : ''
												})(
													<Select disabled={disabled}>
														<Option value={""} >请选择训练等级</Option>
														<Option value={1}>一级</Option>
														<Option value={2}>二级</Option>
														<Option value={3}>三级</Option>
													</Select>
												)}
											</FormItem>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='种犬等级' {...secondLayout} >
												{getFieldDecorator('studLevel', {
													//rules: [{ required: true, message: '请选择职务' }],
													initialValue: isInitialValue ? dogInfor.studLevel : ''
												})(
													<Select disabled={disabled}>
														<Option value={""} >请选择种犬等级</Option>
														<Option value={1}>一级</Option>
														<Option value={2}>二级</Option>
														<Option value={3}>三级</Option>
													</Select>
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='近交系数' {...secondLayout} >
												{getFieldDecorator('inbreedingCoefficient', {
													//rules: [{ required: true, message: '请输入近交系数' }],
													initialValue: isInitialValue ? (dogInfor.inbreedingCoefficient != null ? dogInfor.inbreedingCoefficient : '') : ''
												})(
													<Input placeholder="近交系数" disabled={disabled} />
												)}
											</FormItem>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='繁殖单位' {...secondLayout} >
												{getFieldDecorator('breedUnit', {
													//rules: [{ required: true, message: '请输入繁殖单位' }],
													rules: [{ validator: this.checkBreedUnit }],
													initialValue: isInitialValue ? dogInfor.breedUnit : ""
												})(
													<Input placeholder="繁殖单位" disabled={disabled} />
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='犬只归属' {...secondLayout} >
												{getFieldDecorator('origin', {
													//rules: [{ required: true, message: '请填写犬只归属' }],
													initialValue: isInitialValue ? dogInfor.origin : ''
												})(
													<Select disabled={disabled}>
														<Option value={""} >请选择犬只归属</Option>
														<Option value={0}>内部犬只</Option>
														<Option value={1}>外部犬只</Option>
													</Select>
												)}
											</FormItem>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='服役状态' {...secondLayout} >
												{getFieldDecorator('serviceStatus', {
													//rules: [{ required: true, message: '请填写犬只归属' }],
													initialValue: isInitialValue ? dogInfor.serviceStatus : ''
												})(
													<Select disabled={disabled}>
														<Option value={""} >请选择服役状态</Option>
														<Option value={0}>服役中</Option>
														<Option value={1}>已退役</Option>
													</Select>
												)}
											</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
											<FormItem label='服役单位' {...secondLayout} >
												{getFieldDecorator('serviceUnit', {
													//rules: [{ required: true, message: '请选择服役单位' }],
													initialValue: isInitialValue ? dogInfor.serviceUnit : ''
												})(
													<Select disabled={disabled}>
														<Option value={""} >请选择服役单位</Option>
														{workUnitOption}
													</Select>
												)}
											</FormItem>
										</Col>

										{/*<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='电话' {...secondLayout} hasFeedback>
								               {getFieldDecorator('phoneNumber',{
								               	rules: [{ required: true, message: '请填写电话号码' }],
								               })(
								                  <Input placeholder="电话号码" />
								                )}
							              	</FormItem>
							            </Col>*/}
									</Row>
									{/*<Row gutter={24}>
								      	<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='省市区' {...secondLayout} hasFeedback>
								               {getFieldDecorator('policeNumber',{
								               	rules: [{ required: true, message: '请填写警员编号' }],
								               })(
								                  <Select disabled={disabled}>
								                  	<Option value='0'>一中队</Option>
								                  	<Option value='1'>二中队</Option>
								                  	<Option value='2'>三中队</Option>
								                  </Select>
								                )}
							              	</FormItem>
							            </Col>
							            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
										   <FormItem label='片区' {...secondLayout} hasFeedback>
								               {getFieldDecorator('commandDetachment',{
								               	rules: [{ required: true, message: '请选择片区' }],
								               })(
								                  <Select disabled={disabled}>
								                  	<Option value='0'>一中队</Option>
								                  	<Option value='1'>二中队</Option>
								                  	<Option value='2'>三中队</Option>
								                  </Select>
								                )}
							              	</FormItem>
							            </Col>
									</Row>*/}
								
									<FormItem label='备注' {...firstLayout} >
										{getFieldDecorator('remark', {
											//rules: [{ required: true, message: '请输入外貌特征' }],
											rules: [{ validator: this.checkRemark }],
											initialValue: isInitialValue ? dogInfor.remark : ""
										})(
											<TextArea placeholder="备注" autosize={{ minRows: 3, maxRows: 6 }} disabled={disabled} />
										)}
									</FormItem>
									<Row gutter={24}>
									
										{/* <FormItem label='犬只体检报告' {...secondLayout} >
											<Upload
												className='imageContent'
												name="photoFile"
												action={config.apiUrl + '/api/dog/saveInfo'}
												disabled={disabled}
												accept="image/*"
												listType="picture-card"
												onChange={this.handleChange.bind(this)}
												beforeUpload={this.beforeUpload.bind(this)} >
												{isInitialValue && dogInfor.photo != ''
													? '' : uploadButton
												}
											</Upload>
										</FormItem>
										<FormItem label='犬只图片' {...secondLayout} >
											<Upload
												className='imageContent'
												name="photoFile"
												action={config.apiUrl + '/api/dog/saveInfo'}
												disabled={disabled}
												accept="image/*"
												listType="picture-card"
												onChange={this.handleChange.bind(this)}
												beforeUpload={this.beforeUpload.bind(this)} >
												{isInitialValue && dogInfor.photo != ''
													? '' : uploadButton
												}
											</Upload>
										</FormItem> */}
									</Row>
									<Row gutter={24}>
									<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										<FormItem label='犬只图片' {...secondLayout} >
										<Upload
											className='imageContent'
											name="photoFile"
											action={config.apiUrl + '/api/dog/saveInfo'}
											disabled={disabled}
											accept="image/*"
											listType="picture-card"
											onChange={this.handleChange.bind(this)}
											beforeUpload={this.beforeUpload.bind(this)} >
											{isInitialValue && dogInfor.photo != ''
												? '' : uploadButton
											}
											{
												 (fileList.length == 0  && dogInfor.photo == 'none' ? uploadButton : <img src={this.state.lastestUploadImg} style={{ width: '100px', height: '100px' }} alt="" /> )
												//fileList.length == 0 && this.state.lastestUploadImg === '' ? uploadButton : ''
											}
											{/*											{fileList.length <1 ? uploadButton : <img src={config.apiUrl+`/api/dog/img?id=${dogId}`} style={{ width: '100px',height:'100px' }}alt=""  />}												
*/}										</Upload>

										{previewImage ?
											<div className="pre-container">
												<img src={previewImage} style={{ width: '100px', height: '100px' }} alt="" onClick={() => this.handlePreview()} />
												<Icon type="close-circle-o" className="clear" onClick={() => this.handleClear()} />
											</div>
											: null
										}
										</FormItem>
										</Col>
										<Col xl={12} lg={12} md={24} sm={24} xs={24}>
										<FormItem label='犬只体检表' {...secondLayout} >
										<Upload
											// className='imageContent'
											name="reportFile"
											action={config.apiUrl + '/api/dog/saveInfo'}
											disabled={disabled}
											accept="file/*"
											// listType="picture-card"
											fileList={this.state.reportFilelist}
											onChange={(file) => {this.setState({reportFilelist: [file.file]});}}
											onRemove={() => this.setState({reportFilelist:[]})}
											beforeUpload={(file) => { return false}} >
											<Button>
											<Icon type="upload" /> 点击上传
											</Button>
											</Upload>
										</FormItem>
										</Col>
									</Row>

										<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
											<img alt="example" style={{ width: '100%' }} src={previewImage} />
										</Modal>
										<Modal
											title="选择犬舍"
											visible={this.state.roomIdvisible}
											onOk={() => { this.setState({ roomIdvisible: false }) }}
											onCancel={() => { this.setState({ roomIdvisible: false }) }}
										>
											<FormItem label='选择楼号' {...firstLayout} >
											{getFieldDecorator('houseId', {
												initialValue: isInitialValue ? dogInfor.houseId:1
											})(
												<Select style={{ width: 120 }} onChange={this.selectHouseId}>
													{
														this.state.allHouseData.map((item) => {
															return <Option key={item.id} value={item.id}>{item.name}</Option>

														})
													}
												</Select>
											)}	
											</FormItem>
											<RadioGroup onChange={(e) => { this.setState({ roomIndex: e.target.value, roomId: this.state.dogList[e.target.value].id, roomName: "", roomIdName: this.state.dogList[e.target.value].houseName + this.state.dogList[e.target.value].name }) }} value={this.state.roomIndex}>
												{
													this.state.dogList.map((item, index) => {
														return <Radio key={item.id} value={index}> {item.name}</Radio>
													})
												}

											</RadioGroup>
										</Modal>
										<Modal
											title="选择直系亲属"
											visible={this.state.parentIdVisible}
											onOk={() => { this.setState({ parentIdVisible: false }) }}
											onCancel={() => { this.setState({ parentIdVisible: false }) }}
										>
											<FormItem >
												<span>直系亲属：</span><Tag color="#2db7f5">{this.state.fatherId && this.state.fatherId.toString().length > 0 ? '父：' + (this.state.fatherName + '-' + this.state.fatherId) : '父：-'}</Tag><Tag color="#2db7f5">{this.state.motherId && this.state.motherId.toString().length > 0 ? '母：' + (this.state.motherName + '-' + this.state.motherId) : '母：-'}</Tag>
											</FormItem>
											<FormItem >
												<span>查询：</span><Radio.Group name="radiogroup" defaultValue={1} onChange={this.switchParentSource}>
													<Radio value={1}>父</Radio>
													<Radio value={0}>母</Radio>
												</Radio.Group>
												<div className="global-search-wrapper" style={{ width: 300 }}>
													<AutoComplete
														className="global-search"
														size="large"
														style={{ width: '100%', marginLeft: '45px', display: this.state.parentSelectType ? 'block' : 'none' }}
														onSearch={this.handleSearch}
														onSelect={this.selectParent}
														placeholder="请输入名称关键字，如“牙膏”"
													>
														{fatherChildren}
													</AutoComplete>

													<AutoComplete
														className="global-search"
														size="large"
														style={{ width: '100%', marginLeft: '45px', display: this.state.parentSelectType ? 'none' : 'block' }}
														onSearch={this.handleSearch}
														onSelect={this.selectParent}
														placeholder="请输入名称关键字，如“牙膏”"
													>
														{motherChildren}
													</AutoComplete>
												</div>
											</FormItem>
										</Modal>
									
									{
										!disabled ?
											<Row>
												<Col span={24} style={{ textAlign: 'center', marginTop: '40px' }}>
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
const AddDogForm = Form.create()(FormCompomnent);

const mapStateToProps = state => ({
	loginState: state.login
})
export default connect(
	mapStateToProps
)(AddDogForm)


// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogInfor/AddDogForm.js