import React from 'react';
import {Button,Table,Select ,Popconfirm,Input,DatePicker,Form ,message} from 'antd';
import moment from 'moment';
import Immutable from 'immutable';
import httpAjax from 'libs/httpAjax';
import 'style/app/performance.less';
const Option = Select.Option;
const FormItem = Form.Item;
class PerformanceItemForm extends React.Component{
	constructor(props){
		super(props);
		this.state={
			itemData:this.props.itemData,
			editable:false,
			subjectId:'1',
			startTime:'',
			endTime:'',
			address:'',
			score:'',
			remark:'',
			examinerId:'',
			key:2000,
			content:'',
			opTime:'',
			reason:'',
			selectedRowKeys:[],	
			getAllUsers:[],
			disabled:false		
		}
	}
	componentWillMount(){
	    //获取考核人数据
	    const {tabKey}=this.props;
	    const reqUrl=config.apiUrl+'/api/userCenter/getExaminers'
	    if(tabKey==3||tabKey==5){
		    httpAjax('post',reqUrl,{}).then(res=>{
		     	if(res.code==0){
		     		this.setState({getAllUsers:res.data})
		     	}
		    })
	    }		
	}
	componentWillReceiveProps(nextProps){
		if(Immutable.is(Immutable.Map(this.props.itemData), Immutable.Map(nextProps.itemData))) {
			return
		  }
		const {itemData}=this.state;
		if(itemData!=nextProps.itemData){
			this.setState({itemData:nextProps.itemData})
		}
	}
	addPerformItem=()=>{
		const {itemData,key}=this.state;
		const {tabKey}=this.props;
		this.setState({key:key+1});
		if(tabKey==1||tabKey==2){
			itemData.push(
				{
					key:key,
					id:key,
					userId:'',
					checkYear:'',
					checkMonth:'',
					subjectId:'',
					startTime:'',
					endTime:'',
					address:'',
					score:'',
					remark:'',
				}
			)
		}else if(tabKey==3){
			itemData.push(
				{	
					key:key,
					id:key,
					userId:"",
					checkYear:"",
					checkMonth:"",
					subjectId:"",
					startTime:"",
					address:"",
					score:"",
					remark:"",
					examinerId:""
				}
			)
		}else if(tabKey==4){
			itemData.push(
				{	
					key:key,
					id:key,
					userId:"",
					checkYear:"",
					checkMonth:"",
					content:"",
					startTime:"",
					endTime:"",
					address:"",
					score:"",
					remark:""
				}
			)			
		}else if(tabKey==5){
			itemData.push(
				{	
					key:key,
					id:key,
					userId:"",
					checkYear:"",
					checkMonth:"",
					subjectId:"",
					opTime:'',
					reason:'',
					score:"",
					remark:"",
					examinerId:''
				}
			)
		}
		this.setState({itemData},()=>{
			itemData&&itemData.map((item,index)=>{
				if(item.key>=2000){
					item.editable = true;
					this.setState({disabled:true});
				}
			})
		})
	}
	editableCell(key,record) {
		this.setState({
			subjectId:record.subjectId,
			startTime:record.startTime,
			endTime:record.endTime,
			address:record.address,
			score:record.score,
			remark:record.remark,
			examinerId:record.examinerId,
			content:record.content,
			opTime:record.opTime,
			reason:record.reason
		})
	    const newData = [...this.state.itemData];
	    newData.map((item,index)=>{
	    	if(item.editable){
	    		delete item.editable;
	    	}
	    })
	    const target = newData.filter(item => key === item.id)[0];
	    if (target) {
	      target.editable = true;
	      this.setState({ itemData: newData });
	    }
	}
	mapPerformanceCode=(code)=>{
		if(this.props.tabKey==1){
			switch(code){
				case 1:
				return '搜车辆';
				case 2:
				return '搜房间'; 
				case 3:
				return '搜箱包';
				case 4:
				return '搜箱包';
				case 5:
				return '追踪';
				default:code
			}			
		}else if(this.props.tabKey==2){
			switch(code){
				case 1:
				return '物证搜索';
				case 2:
				return '鉴别'; 
				case 3:
				return '搜捕';
				case 4:
				return '血迹搜捕';
				case 5:
				return '追踪';
				default:code
			}
		}else if(this.props.tabKey==3){
			switch(code){
				case 1:
				return '搜爆';
				case 2:
				return '搜毒'; 
				case 3:
				return '刑侦';
				default:code
			}			
		}else if(this.props.tabKey==5){
			switch(code){
				case 1:
				return '日常管理';
				case 2:
				return '饲养管理'; 
				case 3:
				return '加分数细则';
				default:code
			}			
		}
	}
	renderColumns(text, record, column) {
		if(record.editable==true){
			if(this.props.tabKey==1){
			    return (
				  <div>
				    <Select defaultValue={this.mapPerformanceCode(text)} onChange={value=> this.onSelectChange(value, record.id, column)} style={{width:'100%'}}>
				      	<Option value="1">搜车辆</Option>
				      	<Option value="2">搜房间</Option>
				      	<Option value="3">搜箱包</Option>
				      	<Option value="4">搜场地</Option>
				      </Select>
				  </div>		      
			    )				
			}else if(this.props.tabKey==2){
			    return (
				  <div>
				    <Select defaultValue={this.mapPerformanceCode(text)} onChange={value=> this.onSelectChange(value, record.id, column)} style={{width:'100%'}}>
				      	<Option value="1">物证搜索</Option>
				      	<Option value="2">鉴别</Option>
				      	<Option value="3">搜捕</Option>
				      	<Option value="4">血迹搜捕</Option>
				      	<Option value="5">追踪</Option>
				      </Select>
				  </div>		      
			    )				
			}else if(this.props.tabKey==3){
			    return (
				  <div>
				    <Select defaultValue={this.mapPerformanceCode(text)} onChange={value=> this.onSelectChange(value, record.id, column)} style={{width:'100%'}}>
				      	<Option value="1">搜爆</Option>
				      	<Option value="2">搜毒</Option>
				      	<Option value="3">刑侦</Option>
				      </Select>
				  </div>		      
			    )				
			}else if(this.props.tabKey==5){
			    return (
				  <div>
				    <Select defaultValue={this.mapPerformanceCode(text)} onChange={value=> this.onSelectChange(value, record.id, column)} style={{width:'100%'}}>
				      	<Option value="1">日常管理</Option>
				      	<Option value="2">饲养管理</Option>
				      	<Option value="3">加分数细则</Option>
				      </Select>
				  </div>		      
			    )				
			}				
		}else{
			return 	this.mapPerformanceCode(text)
		}		
	}
	//不可选日期
	disabledDate=(current)=>{
		return current && current < moment().endOf('day');
	}
  	disabledEndDate = (endValue) => {
		const startValue = this.state.startTime;
	 	if(startValue==''||startValue==null){
	 		return endValue && endValue < moment().endOf('day')
	 	}else{
	 		return moment(endValue).format("YYYY-MM-DD HH:mm:ss")<startValue
	 	}	    
  	}  
	renderTimer(text,record,column){
		const { getFieldDecorator } = this.props.form;
		if(record.editable==true){
			if(column=='startTime'){
				return (
					<Form>
					    <FormItem>
				          {getFieldDecorator("startTime", {
				          	rules: [{ required: true, message: '请选择开始时间' }],
				          	//initialValue:text==''||text==null?moment(new Date()):moment(new Date(text))
				          })(
				            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"  disabledDate={this.disabledDate} onChange={(text,dateString)=> this.onTimerChange(text,dateString, record.id, column)}/>
				          )}
				        </FormItem>
					</Form>				
				)				
			}else if(column=='opTime'){
				return (
					<Form >
					    <FormItem>
				          {getFieldDecorator("opTime", {
				          	rules: [{ required: true, message: '请选择时间' }],
				          	//initialValue:text==''||text==null?moment(new Date()):moment(new Date(text))
				          })(
				            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={this.disabledEndDate} onChange={(text,dateString)=> this.onTimerChange(text,dateString, record.id, column)}/>
				          )}
				        </FormItem>
					</Form>				
				)
			}else{
				return (
					<Form >
					    <FormItem>
				          {getFieldDecorator("endTime", {
				          	rules: [{ required: true, message: '请选择结束时间' }],
				          	//initialValue:text==''||text==null?moment(new Date()):moment(new Date(text))
				          })(
				            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={this.disabledEndDate} onChange={(text,dateString)=> this.onTimerChange(text,dateString, record.id, column)}/>
				          )}
				        </FormItem>
					</Form>				
				)				
			}			
		}else{
			return text
		}
	}
	renderInput=(text,record,column)=>{
		const { getFieldDecorator } = this.props.form;
		if(record.editable==true){
			if(column=="address"){
				return 	<Form>
					<FormItem>
			          {getFieldDecorator("address", {
			            rules: [{ required: true, message: '请输入地点' }],
			            initialValue:text
			          })(
			            <Input style={{ margin: '-5px 0' }}  onChange={e => this.onInputChange(e,text, record.id, column)} />
			          )}				
					</FormItem>
				</Form>				
			}else if(column=="score"){
				return 	<Form>
					<FormItem>
			          {getFieldDecorator("score", {
			            rules: [{ required: true, message: '请输入考核分数' },{pattern: /^[0-5]\d*$/,message:'请输入数字且不大于5'}],//,{len:1,message:'不得超过两位数'}
			            initialValue:text
			          })(
			            <Input style={{ margin: '-5px 0' }}  onChange={e => this.onInputChange(e,text, record.id, column)}  />
			          )}				
					</FormItem>
				</Form>				
			}else if (column=="content"){
				return 	<Form>
					<FormItem>
			          {getFieldDecorator("content", {
			            rules: [{ required: true, message: '请输入考核内容' }],
			            initialValue:text
			          })(
			            <Input style={{ margin: '-5px 0' }}  onChange={e => this.onInputChange(e,text, record.id, column)} />
			          )}				
					</FormItem>
				</Form>					
			}else if(column=="reason"){
				return 	<Form>
					<FormItem>
			          {getFieldDecorator("reason", {
			            rules: [{ required: true, message: '请输入考核内容' }],
			            initialValue:text
			          })(
			            <Input style={{ margin: '-5px 0' }}  onChange={e => this.onInputChange(e,text, record.id, column)} />
			          )}				
					</FormItem>
				</Form>				
			}else{
				return 	<Form>
					<FormItem>
			          {getFieldDecorator("remark", {
			            //rules: [{ required: true, message: '请输入备注内容' }],
			            initialValue:text
			          })(
			            <Input style={{ margin: '-5px 0' }}  onChange={e => this.onInputChange(e,text, record.id, column)} />
			          )}				
					</FormItem>
				</Form>					
			}
		}else{
			return text
		}
	}
	//render考核人列表
	renderAllUsers=(text, record, column)=>{
		const {getAllUsers}=this.state;
		const { getFieldDecorator } = this.props.form;
		if(record.editable==true){
			const AllUsersOption=getAllUsers&&getAllUsers.map((item,index)=>{
				return <Option value={item.id+'&'+item.name}  key={index}>{item.name}</Option>
			})
			return 	(
				<Form>
					<FormItem style={{width:'90px'}}>
			          {getFieldDecorator("examiner", {
			            rules: [{ required: true, message: '请选择考核人' }],
			            //initialValue:record.examinerId
			          })(
			            <Select   style={{width:'100%'}} >
				      		{AllUsersOption}
				      	</Select>
			          )}				
					</FormItem>
				</Form>	
			)		
		}else{
			return text;
		}
	}	
	//修改的内容
	onInputChange(e,text, key, column) {
	    const newData = [...this.state.itemData];
	    const target = newData.filter(item => key === item.id)[0];
	    if (target) {
	    	if(column=='address'){
	    		this.setState({address:e.target.value})
	    	}else if(column=='score'){
	    		this.setState({score:e.target.value})
	    	}else if(column=='remark'){
	    		this.setState({remark:e.target.value})
	    	}else if(column=='reason'){
	    		this.setState({reason:e.target.value})
	    	}else if(column=='content'){

	    	}
	      target[column] = e.target.value;
	      this.setState({ itemData: newData });
	    }
	}
	onSelectChange=(value, key, column)=> {
		this.setState({subjectId:value});
	    const newData = [...this.state.itemData];
	    const target = newData.filter(item => key === item.id)[0];
	    if (target) {
	      target[column] = value;
	      this.setState({ itemData: newData });
	    }		
	}
	//时间发生变化
	onTimerChange=(text,dateString,key,column)=>{
		if(column=='startTime'){
			this.setState({startTime:dateString})
			this.props.form.setFieldsValue({"endTime":''});
		}else if(column=='endTime'){
			this.setState({endTime:dateString})
		}
		const newData = [...this.state.itemData];
	    const target = newData.filter(item => key === item.id)[0];
	    if (target) {
	      target[column] = dateString;
	      this.setState({ itemData: newData });
	    }
	}	
	//取消编辑
	cancel=(key)=> {
	    const newData = [...this.state.itemData];
	    const target = newData.filter(item => key === item.id)[0];
	    if (target) {
	      //Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
	      delete target.editable;
	      this.setState({ itemData: newData });
	    }
	}
	//保存编辑内容
	save(key) {
		let {subjectId,startTime,endTime,address,score,remark,examinerId,content,reason}=this.state;
		const {tabKey}=this.props;
	    const newData = [...this.state.itemData];
	    const target = newData.filter(item => key === item.id)[0];
	    let reqUrl='';
	    subjectId==null||subjectId=='' ? subjectId='1' : subjectId;
		const performanceChangeWeek=JSON.parse(sessionStorage.getItem("performanceChangeWeek"));		
		const userId= performanceChangeWeek.userId;
		const checkYear=performanceChangeWeek&&performanceChangeWeek.yearMonth.split("-")[0];
		const checkMonth=performanceChangeWeek&&performanceChangeWeek.yearMonth.split("-")[1];
	    if (target) {
	      this.props.form.validateFields((err, values) => {
	      	if(!err){
		      	const examiner=values.examiner&&values.examiner!=undefined?values.examiner.split("&")[0]:examinerId;
		      	const startTime=moment(values.startTime).format("YYYY-MM-DD HH:mm:ss");
		      	const endTime=moment(values.endTime).format("YYYY-MM-DD HH:mm:ss")	      		
	      		delete target.editable;
			      let  options={};
			      if(tabKey==1||tabKey==2){
				      if(key>=2000){
				      	options={
					      	userId:userId,
					      	checkYear:checkYear,
					      	checkMonth:checkMonth,
					      	subjectId,
					      	startTime:startTime,
					      	endTime:endTime,
					      	address:values.address,
					      	score:values.score,
					      	remark:values.remark
				      	}
				      }else{
				      	options={
					      	id:key,
					      	userId:userId,
					      	checkYear:checkYear,
					      	checkMonth:checkMonth,
					      	subjectId,
					      	startTime:startTime,
					      	endTime:endTime,
					      	address:values.address,
					      	score:values.score,
					      	remark:values.remark
				      	}
				      }			      	
			      }else if(tabKey==3){
				      if(key>=2000){
				      	options={
					      	userId:userId,
					      	checkYear:checkYear,
					      	checkMonth:checkMonth,
					      	subjectId,
					      	startTime:startTime,
					      	address:values.address,
					      	score:values.score,
					      	remark:values.remark,
					      	examinerId:examiner
				      	}
				      }else{
				      	options={
					      	id:key,
					      	userId:userId,
					      	checkYear:checkYear,
					      	checkMonth:checkMonth,
					      	subjectId,
					      	startTime:startTime,
					      	address:values.address,
					      	score:values.score,
					      	remark:values.remark,
					      	examinerId:examiner
				      	}
				      }
			      }else if(tabKey==4){
				      if(key>=2000){
				      	options={
					      	userId:userId,
					      	checkYear:checkYear,
					      	checkMonth:checkMonth,
					      	content:values.content,
					      	startTime:startTime,
					      	endTime:endTime,
					      	address:values.address,
					      	score:values.score,
					      	remark:values.remark
				      	}
				      }else{
				      	options={
					      	id:key,
					      	userId:userId,
					      	checkYear:checkYear,
					      	checkMonth:checkMonth,
					      	content:values.content,
					      	startTime:startTime,
					      	endTime:endTime,
					      	address:values.address,
					      	score:values.score,
					      	remark:values.remark
				      	}
				      }
			      }else if(tabKey==5){
				      if(key>=2000){
				      	options={
					      	userId:userId,
					      	checkYear:checkYear,
					      	checkMonth:checkMonth,
					      	subjectId,
					      	opTime:moment(values.opTime).format("YYYY-MM-DD HH:mm:ss"),					      	
					      	reason:values.reason,
					      	score:values.score,
					      	remark:values.remark,
					      	examinerId:examiner
				      	}
				      }else{
				      	options={
					      	id:key,
					      	userId:userId,
					      	checkYear:checkYear,
					      	checkMonth:checkMonth,
					      	subjectId,
					      	opTime:moment(values.opTime).format("YYYY-MM-DD HH:mm:ss"),					      	
					      	reason:values.reason,
					      	score:values.score,
					      	remark:values.remark,
					      	examinerId:examiner
				      	}
				      }
			      }
			      this.setState({ itemData: newData });
			      this.cacheData = newData.map(item => ({ ...item }));
			      if(tabKey==1){
			      	reqUrl=config.apiUrl+'/api/trainCheck/addOrUpdateCheckSearch';
			      }else if(tabKey==2){
			      	reqUrl=config.apiUrl+'/api/trainCheck/addOrUpdateCriminalInvestigation';
			      }else if(tabKey==3){
					reqUrl=config.apiUrl+'/api/trainCheck/addOrUpdateCheckTrain';
			      }else if(tabKey==4){
			      	reqUrl=config.apiUrl+'/api/trainCheck/addOrUpdateCheckDogUse';
			      }else if(tabKey==5){
			      	reqUrl=config.apiUrl+'api/trainCheck/addOrUpdateCheckDaily';
			      }
			      httpAjax('post',reqUrl,options).then(res=>{
					if(res.code==0){
						message.success("添加/修改成功");
						this.updateItemDate();
						this.setState({disabled:false});						
					}else{
						message.error("修改失败")
					}
			      })
	      	}
	      })	
	  }
	}
	//更新数据
	updateItemDate=()=>{
		const {tabKey}=this.props;
		const performanceChangeWeek=JSON.parse(sessionStorage.getItem("performanceChangeWeek"));		
		const userId= performanceChangeWeek.userId;
		const checkYear=performanceChangeWeek&&performanceChangeWeek.yearMonth.split("-")[0];
		const checkMonth=performanceChangeWeek&&performanceChangeWeek.yearMonth.split("-")[1];
		let  reqUrl="";
  		const params={
			userId:userId,
			year:checkYear,
			month:checkMonth
		}
		if(tabKey==1){
			reqUrl=config.apiUrl+'/api/trainCheck/listCheckSearch';			
		}else if (tabKey==2){
			reqUrl=config.apiUrl+'/api/trainCheck/listCriminalInvestigation';
		}else if (tabKey==3){
			reqUrl=config.apiUrl+'/api/trainCheck/listCheckTrain';
		}else if(tabKey==4){
			reqUrl=config.apiUrl+'/api/trainCheck/listCheckDogUse';
		}else if(tabKey==5){
			reqUrl=config.apiUrl+'/api/trainCheck/listCheckDaily';
		}
		this.props.getItemData(reqUrl,params);
		this.setState({examinerId:''})		 
	}
	RowSelectChange=(selectedRowKeys)=>{
    	this.setState({ selectedRowKeys });
	}
	deleteItem=()=>{
		//const newData = [...this.state.itemData];
		const {selectedRowKeys}=this.state;
		const {tabKey}=this.props;
		let delUrl='';
		if(tabKey==1){
			delUrl=config.apiUrl+'/api/trainCheck/deleteCheckSearchByIds';			
		}else if (tabKey==2){
			delUrl=config.apiUrl+'/api/trainCheck/deleteCriminalInvestigationByIds';
		}else if (tabKey==3){
			delUrl=config.apiUrl+'/api/trainCheck/deleteCheckTrainByIds';
		}else if(tabKey==4){
			delUrl=config.apiUrl+'/api/trainCheck/deleteCheckDogUseByIds';
		}else if(tabKey==5){
			delUrl=config.apiUrl+'/api/trainCheck/deleteCheckDailyByIds';
		}
		let options={
			ids:selectedRowKeys
		};
		if(selectedRowKeys.length>=1){
			httpAjax('post',delUrl,options).then(res=>{
				if(res.code==0){
					message.success("删除成功");
					this.updateItemDate();
				}else{
					message.error("删除失败")
				}
			})
		}else{
			message.warn('请选择要删除的内容')
		}
	}			 	
	render(){
		const {editable,itemData,selectedRowKeys}=this.state;
		const {tabKey}=this.props;
		const rowSelection={
			selectedRowKeys,
			onChange: this.RowSelectChange
		};		
		const itemColumns=[
			{
				title:'序号',
				dataIndex:'id',
				key:'id'
			},{
				title:'考核项目',
				width:120,
				dataIndex:tabKey==1||tabKey==2||tabKey==3||tabKey==5?'subjectId':"content",
				key:tabKey==1||tabKey==2||tabKey==3||tabKey==5?'subjectId':"content",
				render: (tabKey==1||tabKey==2||tabKey==3||tabKey==5)?(text, record) => this.renderColumns(text, record, 'subjectId'):(text, record) => this.renderInput(text, record, 'content'),
			},{
				title:tabKey!=5 ? '开始时间':'时间',
				dataIndex:tabKey!=5 ? 'startTime' :'opTime',
				key:tabKey!=5 ? 'startTime' :'opTime',
				render:tabKey!=5? (text, record) => this.renderTimer(text, record,"startTime"):(text, record) => this.renderTimer(text, record,"opTime"),
			},{
				title:tabKey==1||tabKey==2||tabKey==4?'结束时间':"考核人",
				dataIndex:tabKey==1||tabKey==2||tabKey==4?'endTime':"examiner",
				key:tabKey==1||tabKey==2||tabKey==4?'endTime':"examiner",
				render: tabKey==1||tabKey==2||tabKey==4?(text, record) => this.renderTimer(text, record,"endTime") :(text, record) => this.renderAllUsers(text, record, 'examiner'),
			},{
				title:tabKey!=5 ? '地点':'事由',
				dataIndex:tabKey!=5 ? 'address' :'reason',
				key:tabKey!=5 ? 'address' :'reason',
				render:tabKey!=5? (text, record) => this.renderInput(text, record, 'address'):(text, record) => this.renderInput(text, record, 'reason'),
			},{
				title:'评分(5分)',
				dataIndex:'score',
				key:'score',
				render: (text, record) => this.renderInput(text, record, 'score'),
			},{
				title:'备注',
				dataIndex:'remark',
				key:"remark",
				render: (text, record) => this.renderInput(text, record, 'remark'),
			},{
				title:'操作',
				dataIndex:'opreation',
				width:120,
			    render: (text, record,index) => {
			        const { editable } = record;
			        return (
			          <div className="editable-row-operations">
			            {
			              editable ?
			                <span>
			                <Button onClick={() => this.save(record.id)} size='small' style={{marginRight:'10px'}}>保存</Button>
			                <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
			                   <a>取消</a>
			                </Popconfirm>
			                </span>
			                : <div>
			                	<Button size='small' style={{marginRight:'10px'}}    onClick={()=>this.editableCell(record.id,record)} >编辑</Button>
			                </div>
			            }
			          </div>
			        );
			    },				
			}
		];
		return(
			<div>
				<div style={{marginBottom:'10px'}}>
					<Button size='small' type='primary'  onClick={this.addPerformItem}  style={{marginRight:'10px'}} disabled={this.state.disabled}>新增</Button>
					<Button size='small' onClick={this.deleteItem}>删除</Button>
					{tabKey==1 ?
						<span>（满分4X4X5分=80分，每少一次训练减5分，每半个工作日最多加搜毒搜爆训练分5分）</span>: ''
					}
					{tabKey==2 ||tabKey==3||tabKey==5?
						<span>（两个科目至少训练次数相加不少于16次），每次5分，满分16X5分=80分，每半个工作日最多加刑侦科目训练分5分）</span>: ''
					}
				</div>
				<Table  columns={itemColumns}   dataSource={itemData} pagination={false} bordered   rowSelection={rowSelection}  rowKey='id' className='performanceTableForm' />					
			</div>
		)
	}
}
const PerformanceItem= Form.create()(PerformanceItemForm)
export default PerformanceItem;


// WEBPACK FOOTER //
// ./src/components/admin/tables/performanceAppraisal/PerformanceItemTable.js