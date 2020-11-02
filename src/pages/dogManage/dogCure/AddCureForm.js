import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message,Tag,Card,Collapse,Row,Col,Select,DatePicker,Form,Input } from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';

import { firstLayout,secondLayout} from 'components/view/common/Layout';
import MedicalRecordTable from './tables/MedicalRecordTable';
import CureRecordTable from './tables/CureRecordTable';
import moment from 'moment';
import 'style/view/common/detailTable.less';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;
class DogTable extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      dogInfo:'',
      vaccineType:'',
      vaccineTime:'',
      nextVaccineRemindingTime:'',
      disabled:false,
      isInitialValue:false,
      detailLoading:false,
      medicalRecord:[],
      cureDataSource:[],
      key:2000,
      diseaseType:[],
      drugInfo:[],
      showRecord:true,
      dogId:"",
      treatmentRecordHis:[],   //发病记录
      treatmentRecordInfo:"",  //用药记录
      prescriptionsDelIds:[],
      recordId:'',
      allDogs: [],
    }
  }
  componentWillMount(){
      const recordId=sessionStorage.getItem("recordId") || this.props.location.query&&this.props.location.query.dogId //  ; 
      const formStatus=sessionStorage.getItem("formStatus") //this.props.location.query&&this.props.location.query.formStatus  // ;
      this.setState({recordId:recordId})
      //获取单个数据信息
      // recordId&& this.getInfo(recordId);
      if(formStatus=='view'){
        this.setState({disabled:true,isInitialValue:true},()=>{
          recordId&& this.getInfo(recordId)
        })
      }else if(formStatus=='edit'){
        this.setState({isInitialValue:true},()=>{
          recordId&&this.getInfo(recordId)
        })
      }
    //获取疾病类型   //获取药品类型 
    const promises = ['/api/basicData/diseaseType','/api/basicData/drugInfo', '/api/dog/listAll'].map(function (item) {
      return httpAjax('post',config.apiUrl+item,{})
    });
    let _this=this;
    Promise.all(promises).then(values=>{
      if(values[0].code==0){
        _this.setState({diseaseType:values[0].data});
      }
      if(values[1].code==0){
        _this.setState({drugInfo:values[1].data});     
      }
      if(values[2].code==0) {
        _this.setState({allDogs:values[2].data});     
      }
    });
  }

 getInfo=(id)=>{
    httpAjax('post',config.apiUrl+'/api/treatmentRecord/info',{id}).then((res)=>{
      let { code,data } = res;
      if(0==code){
        this.setState({treatmentRecordHis:data.treatmentRecordHisList,
          loading:false,
          treatmentRecordInfo:data.treatmentRecordInfo,
          dogInfo:data.dogInfo,
          cureDataSource:data.treatmentRecordInfo&&data.treatmentRecordInfo.prescriptions
        },()=>{
            this.state.cureDataSource&&this.state.cureDataSource.map((item,index)=>{
                item.editable = true;
            })            
        })
      }      
    })
  }
  addCureRecord=()=>{
    let {cureDataSource,key}=this.state;
    const newData =
      { 
        key:key,
        drug:'',
        times:'',
        days:'',
        purpose:'',
        editable:true
      }      
    this.setState({key:++key})
    this.setState({cureDataSource: [...cureDataSource, newData]},()=>{
      cureDataSource&&cureDataSource.map((item,index)=>{
          item.editable = true;
      })
    })   
  }
  baseHeader=(title)=>{
    return(
      <div>
        <Icon type="bars" />
        &nbsp;&nbsp;&nbsp;
        <Tag color="#2db7f5">{title}</Tag>
      </div>
    )
  }
  mapVaccineType=(type)=>{
      switch(type){
        case 1:
        return '掉毛';
        case 2:
        return '呕吐'; 
        case 3:
        return '发热';
        case 4:
        return '搜箱包';
        case 5:
        return '追踪';
        default:type
      }
  }
  renderSelect =(text,record,column)=>{
    const { getFieldDecorator } = this.props.form;
    const {drugInfo,isInitialValue}=this.state;
    const drugInfoOption= drugInfo&&drugInfo.map((item,index)=>{
        return <Option value={item.id} key={index}>{item.name}</Option>
    })
    return (
      <FormItem>
          {getFieldDecorator(`drug&${record.key}`, {
            rules: [{ required: true, message: '请输入药品名称' }],
            initialValue:isInitialValue ? record.drugId :""
          })(
            <Input />
          )}
        </FormItem>                   
    )      
  }
  SelectChange=(value, record, column)=>{
      const newData = [...this.state.cureDataSource];
      const target = newData.filter(item => record.key === item.key)[0];
      if (target) {
        target[column] = value;
        this.setState({ cureDataSource: newData });
      }      
  }
  //选择犬只 获取信息
  selectDog=(key)=>{
    this.setState({detailLoading:true});
    httpAjax('post',config.apiUrl+'/api/treatmentRecord/getRecordsByDogId',{dogId:key}).then(res=>{
      const data=res.data;
      if(res.code==0){
        this.setState({detailLoading:false,treatmentRecordHis:data.treatmentRecordHisList,dogInfo:data.dogInfo})
      }
    })
  }
  checkNumber = (rule, value, callback) => {
    const re = /^\+?[1-9][0-9]*$/;
    if (re.test(value)) {
        console.log(value);
        if(value>100){
            console.log("come");
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

  renderInput(text,record,column){
    const { getFieldDecorator } = this.props.form;
    if(column=='times'){
      return (
          <FormItem>
                {getFieldDecorator(`times&${record.key}`, {
                  rules: [{ required: true, message: '请填写用药次数' },{ validator: this.checkNumber }],
                  initialValue:text
                })(
                  <Input  onChange={e=>this.valueChange(e,text,record,column)} />
                )}
          </FormItem>      
      )       
    }else if(column=='days'){
      return (
          <FormItem>
              {getFieldDecorator(`days&${record.key}`, {
                rules: [{ required: true, message: '请填写用药天数' },{ validator: this.checkNumber }],
                initialValue:text
              })(
                 <Input onChange={e=>this.valueChange(e,text,record,column)}/>
              )}
            </FormItem>       
      )        
    } else if (column == 'purpose') {
      return (
        <FormItem>
            {getFieldDecorator(`purpose&${record.key}`, {
              rules: [{ required: true, message: '请填写使用方式' },{ max: 25, message: '使用方式长度不超过25' }],
              initialValue:text
            })(
               <Input onChange={e=>this.valueChange(e,text,record,column)}/>
            )}
          </FormItem>       
    )       
    }else if (column == 'drug') { // drug
      return (
        <FormItem>
            {getFieldDecorator(`drug&${record.key}`, {
              rules: [{ required: true, message: '请填写操作方式' },{ max: 25, message: '操作方式长度不超过25' }],
              initialValue:text
            })(
               <Input onChange={e=>this.valueChange(e,text,record,column)}/>
            )}
          </FormItem>       
    )       
    }  
  }
  valueChange=(e,text,record,column)=>{
    const newData = [...this.state.cureDataSource];
    const target = newData.filter(item => record.key === item.key)[0];
    if (target) {
      if(column=='drug'){
        target.drug=e.target.value
      }else if(column=='days'){
         target.days=e.target.value
      }else if(column=='times'){
        target.times=e.target.value
     }else if(column=='purpose'){
      target.purpose=e.target.value
   }
      this.setState({ cureDataSource: newData });
    }   
  }
  renderOption=(options)=>{
    return options&&options.map((item,index)=>{
      return <Option value={item.id} key={index}>{item.name}</Option>
    })
  }
  //删除治疗记录
  deleteCureRecord=(keys)=>{
    const newSet = this.state.cureDataSource;
    for(var i = 0 ; i < newSet.length; i++){
        if(newSet[i].key == keys){
            newSet.splice(i,1);
        }
    }
    let prescriptionsDelIds=[];
    if(keys<2000){
      prescriptionsDelIds.push(keys)      
    }
    this.setState({
        cureDataSource:newSet,prescriptionsDelIds:prescriptionsDelIds
    })
  }
  //保存编辑内容
  handleSubmit=(e)=> {
      e.preventDefault();
      const {recordId,prescriptionsDelIds,cureDataSource,isInitialValue }=this.state;
      //  recordId 单条数据的ID
      const { id } = JSON.parse(sessionStorage.getItem('user'));   //登录用户ID
      let params={}  //,prescriptions=[];
      this.props.form.validateFields((err, values) => {
        let count=0,obj={}; 
        if(!err){
          Object.keys(values).forEach((key)=>{
            if((key.indexOf("drugId")== -1)&&(key.indexOf("number")== -1)&&(key.indexOf("days")== -1)){
              params[key]=values[key];
              if(key==='morbidityTime'){
                params[key]=moment(new Date(values[key])).format('YYYY-MM-DD')
              }                
            }
          })
          cureDataSource&&cureDataSource.map(item=>{
            if(item.key>=2000){
              delete item.key
            }
            delete item.editable
          })
          params.prescriptions=cureDataSource;
          params.veterinaryId=id;
          if(isInitialValue){
            params.prescriptionsDelIds=prescriptionsDelIds  ;
            params.id=recordId;          
          }
          if(this.state.recordId) {
            params.dogId = this.state.recordId;
          }
          httpAjax('post',config.apiUrl+'/api/treatmentRecord/updateOrSaveInfo',params).then((res)=>{
            if(res.code==0){ 
              message.success(this.state.isInitialValue==true ? '修改成功' :'添加成功')  
              window.location.href=config.apiUrl+'#/app/dog/cure';            
            }else{
              message.error(this.state.isInitialValue==true ? '修改失败' :'添加失败')
            }
            sessionStorage.setItem('recordId','')
          })
        }            
    })
  }     
  collapseChange(keys){
    if(keys.includes('5')){
      this.setState({showRecord:true})
    }
  }  
  render(){
    const {allDogs,cureDataSource,loading,dogInfo,disabled,treatmentRecordHis,treatmentRecordInfo,detailLoading,diseaseType,isInitialValue}=this.state;
    const {getFieldDecorator}=this.props.form;
    const recordsColumns=[
      {
        title:'药物或操作',
        dataIndex:'drug',
        render:(text, record,index) => this.renderInput(text, record,"drug")
      },{
        title:'次数',
        dataIndex:'times',
        render:(text, record,index) => this.renderInput(text, record,"times")        
      },{
        title:'天数',
        dataIndex:'days',
        render:(text, record,index) => this.renderInput(text, record,"days")
      }, {
        title: '用法',
        dataIndex:'purpose',
        render:(text, record,index) => this.renderInput(text, record,"purpose")
      }
    ]
    recordsColumns.push(
      {
        title:'操作',
        dataIndex:'id',
        render:(text,record,index)=>{
          return  <div className="editable-row-operations">
              {
                  <Button  size='small' onClick={()=>this.deleteCureRecord(record.key)}>删除</Button>
              }
            </div>
        }
      }
    );
    const canEdit = this.props.location.pathname.indexOf('Edit') > 0
    return (
		  <div>
      {
         dogInfo && dogInfo.medicalReportName ?  <Button type="primary" style={{position: 'absolute',top: '144px',right: '80px',zIndex: 10}}>
      <a href={'/api/dog/dlmedicalReport?id='+this.state.recordId} target="_blank" rel="noopener noreferrer">查看体检表</a></Button> : ''
      }
     
          <Card title={this.state.title}>
          <Form onSubmit={this.handleSubmit}>
            <Collapse defaultActiveKey={this.state.showRecord?['1','2','3','4',"5","6"]:['1','2','3','4']} onChange={this.collapseChange.bind(this)}>
            {!disabled && !isInitialValue? 
              <Panel showArrow={false} header={this.baseHeader("选择犬只")} key="1">
                <Row gutter={24} >
                  <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Row gutter={24}>
                      <Col xl={12} lg={12} md={24} sm={24} xs={24}>
    					          <FormItem label='犬只名称' {...secondLayout}  >
      			               {getFieldDecorator('dogId',{
      			               	rules: [{ required: true, message: '请选择犬只' }],
      			               })(
      			                  <Select disabled={disabled}  onChange={this.selectDog} >
      				                 {allDogs.map((t) => <Option value={t.id} key={t.id}>{t.name}</Option>)}
      								        </Select>
      			                )}
    		              	</FormItem>
                      </Col>
                    </Row>
					        </Col>
                </Row>
              </Panel>  : null
            }          
              <Panel showArrow={false} header={this.baseHeader("基础信息")} key="2">
                <Row gutter={24}>
                  <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24} >
                      <div className='baseDataTable'>
                        <Row >
                            <Col  span={6}>档案编号</Col>
                            <Col  span={6}>{dogInfo&&dogInfo.number ? dogInfo.number :'暂无数据'}</Col>
                            <Col  span={6}>犬只名称</Col>
                            <Col  span={6}>{dogInfo&&dogInfo.name ?dogInfo.name :'暂无数据'}</Col>                    
                        </Row>
                        <Row >
                            <Col  span={6}>犬只性别</Col>
                            <Col  span={6}>{dogInfo&&dogInfo.sex ? dogInfo.sex  :'暂无数据'}</Col>
                            <Col  span={6}>出生日期</Col>
                            <Col  span={6}>{dogInfo&&dogInfo.birthday ? moment(dogInfo.birthday).format('YYYY-MM-DD') :'暂无数据'}</Col>                    
                        </Row>
                        <Row >
                            <Col  span={6}>犬只品种</Col>
                            <Col  span={6}>{dogInfo&&dogInfo.breed ? dogInfo.breed :'暂无数据'}</Col>
                            <Col  span={6}>芯片号</Col>
                            <Col  span={6}>{dogInfo&&dogInfo.chipCode ? dogInfo.chipCode :'暂无数据'}</Col>                    
                        </Row>                                                                                                                     
                      </div>
                  </Col>
                </Row>
              </Panel>
              {
                !disabled ?
                <Panel showArrow={false} header={this.baseHeader("病情记录")} key="3">
                    <Row gutter={24} >
                      <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Row gutter={24}>
                          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='发病时间' {...secondLayout}  >
                               {getFieldDecorator('morbidityTime',{
                                rules: [{ required: true, message: '请选择发病时间' }],
                                initialValue:isInitialValue? moment(treatmentRecordInfo.morbidityTime) :moment(new Date())
                               })(
                                    <DatePicker  format="YYYY-MM-DD"  disabled={ canEdit } />
                                )}
                              </FormItem>
                          </Col>
                          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                              <FormItem label='疾病类型' {...secondLayout} >
                                {getFieldDecorator('disease',{
                                  rules:[{required:true,message:'请选择疾病类型'}],
                                  initialValue:isInitialValue ? treatmentRecordInfo.treatmentResults :""
                                })(
                                  <Select disabled={disabled}   filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} >
                                      {this.renderOption(diseaseType)}
                                  </Select>
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    <Row gutter={24} >
                      <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Row gutter={24}>
                          <Col  xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='症状' {...secondLayout}  >
                               {getFieldDecorator('symptom',{
                                rules: [{ required: true, message: '请填写症状' },{ max: 25, message: '症状长度不超过25' }],
                                initialValue:isInitialValue ? treatmentRecordInfo.symptom :""
                               })(
                                    <Input disabled={canEdit} />
                                )}
                              </FormItem>
                          </Col>
                          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <FormItem label='治疗结果' {...secondLayout} >
                              {getFieldDecorator('treatmentResults',{
                                rules:[{required:true,message:'请选择治疗结果'}],
                                initialValue:isInitialValue ? treatmentRecordInfo.treatmentResults :""
                              })(
                                <Select disabled={disabled}   >
                                    <Option value={1}>治愈</Option>
                                    <Option value={2}>未治愈</Option>
                                </Select>
                              )}
                            </FormItem>
                          </Col>
                          </Row>
                        </Col>
                      </Row>                    
                </Panel> : null
              }
              {
                disabled ?
                <Panel showArrow={false} header={this.baseHeader("治疗记录")} key="6">
                  <Row gutter={24}>
                    <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24} >
                      {this.state.showRecord?<CureRecordTable dataSource={treatmentRecordInfo}/>:null}
                    </Col>
                  </Row>
                </Panel>   : null             

              } 
              {
                !disabled ?                           
                <Panel showArrow={false} header={this.baseHeader("治疗记录")} key="4">
                  <Row gutter={24}>
                    <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24} >
                        <Button onClick={this.addCureRecord} size='small' style={{marginBottom:'10px'}}>添加治疗记录</Button>
                        <Table  id='cureTable'
                          columns={recordsColumns}
                          dataSource={cureDataSource}
                          pagination={false} 
                          bordered 
                          rowKey='key'
                          ref='cureTable'
                          />
                          {/* <AddCureTable   wrappedComponentRef={ref=>this.CureTable = ref} /> */}
                    </Col>
                  </Row>
                </Panel> : null
              }
              <Panel showArrow={false} header={this.baseHeader("病历记录")} key="5">
                <Row gutter={24}>
                  <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24} >
                    {this.state.showRecord?<MedicalRecordTable dataSource={treatmentRecordHis}/>:null}
                  </Col>
                </Row>
              </Panel>               
            </Collapse>
            {
              !disabled ? 
                <Row gutter={24}>
                  <Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24} style={{ textAlign: 'center',marginTop:'40px' }}>
                    <Button type="primary" htmlType='submit' >提交</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                      清空
                    </Button>
                  </Col>
                </Row> :null
            }         
          </Form>
          </Card>
	    </div>
    )
  }
}
export default Form.create()(DogTable);


// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogCure/AddCureForm.js