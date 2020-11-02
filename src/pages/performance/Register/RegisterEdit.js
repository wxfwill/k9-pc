import React,{ Component } from 'react';
import { Card,Select,Form,Collapse,Table,Modal,Row,Col,Input,Button,Icon,message,Tag } from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import EditableTable from './EditableTable';
import SubjectDetail from  './SubjectDetail';
import { firstLayout,secondLayout} from 'components/view/common/Layout';
import moment from 'moment';
import 'style/app/performance.less';
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;
class RegisterEdit extends Component{
  constructor(props){
    super(props);
    this.state= {
      record:'',
      dataSource:[],
      automaticData:[],
      modalLoading:false,
      visible: false,
      pageSize:10,
      currPage:1,
      isShow:true,
      isSubjectDetail:false,
      subjectInfo:'',
      autonomyData:[],
      totalScore:''
    }
  }

  componentDidMount(){
    if(this.props.location.query&&this.props.location.query.record) {
      let {record,checkDate} = this.props.location.query
      this.fetch(record,checkDate);
   }
  }
  fetch(record,checkDate){
    httpAjax('post',config.apiUrl+'/api/performanceCheck/performanceCheckInfo',{userId:record.userId,checkDate:checkDate}).then((res)=>{
      let {autonomyData,automaticData} = this.state;
      automaticData.dogTrain=[];
      automaticData.dogUse=[];
      automaticData.outdoor=[];
      autonomyData.dailyManage=[];
      autonomyData.trainCheck=[];
      res.data.map((item) => {
          if(item.scoreType==0){
            if(item.typeId==1){
              automaticData.dogTrain.push(item);
            }else if(item.typeId==3){
              automaticData.dogUse.push(item);
            }else if(item.typeId==5){
              automaticData.outdoor.push(item);
            }
          
          }else{
            if(item.typeId==2){
              autonomyData.trainCheck.push(item);
            }else if(item.typeId==4){
              autonomyData.dailyManage.push(item);
            }
          }
      });
      this.setState({dataSource:res.list,record:record,autonomyData:autonomyData,automaticData:automaticData,checkDate:checkDate,totalScore:record.totalScore})
    }).catch(function(error){
      console.log(error);
    })
  }

  callback(key) {
    console.log(key);
  }
  showModal = (subjectInfo) => {
    let {record} = this.state;
    subjectInfo.userId=record.userId;
    this.setState({
      isSubjectDetail: true,
      subjectInfo:subjectInfo,
    });
  }
  hideModal = () => {
    this.setState({
      isSubjectDetail: false,
    });
  }
  //取消当月资格
  cancelRank = () =>{
    this.props.form.validateFields((error, row) => {
      if (!error) {
        this.setState({ modalLoading: true });
        row.id=this.state.record.id;
        row.pageSize=this.state.pageSize;
        row.currPage=this.state.currPage;
        httpAjax('post',config.apiUrl+'/api/performanceCheck/cancelRank',{...row}).then((res)=>{
           
              this.setState({ isShow:false, visible: false,});
           
            message.success("取消成功！");
          }).catch(function(error){
            console.log(error);
          })
      }
    });
  }
  updateTotalScore = (score=0) =>{
    let {totalScore}=this.state;
    totalScore=Number(totalScore)+Number(score);
      this.setState({
        totalScore:totalScore
      })
  }
  render(){
    const {record,autonomyData,automaticData,checkDate,isShow,modalLoading,isSubjectDetail,subjectInfo,totalScore} = this.state;
    const { getFieldDecorator  } = this.props.form;
    const title=moment(checkDate).format('M')+'月绩效';
    const baseData = [{
      key: '1',
      month: moment(checkDate).format('M')+'月考核',
      name: record.name,
      duty: record.duty,
      totalScore: totalScore
    }];
    
    const baseColumns = [{
      title: '考核月份',
      dataIndex: 'month',
      key: 'month',
    }, {
      title: '被考核人',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '职位',
      dataIndex: 'duty',
      key: 'duty',
    }, {
      title: '绩效总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
    }];
    
    const automaticColumns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '考核项目',
      dataIndex: 'subjectName',
      key: 'subjectName',
    }, {
      title: '指标名称',
      dataIndex: 'item',
      key: 'item',
    }, {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
    },{
      title:'操作',
      dataIndex:'opreation',
      key:'opreation'  ,
      render:(text,record,index)=>{
        return <div>
            <span onClick={()=>this.showModal(record)}  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='eye' style={{margin:'0 10px', }}  />查看</span>       
        </div>
      }
    }];
    
    const autonomyColumns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '考核项目',
      dataIndex: 'subjectName',
      key: 'subjectName',
    }, {
      title: '指标名称',
      dataIndex: 'item',
      key: 'item',
    }, {
      title: '考核人',
      dataIndex: 'examinerStr',
      key: 'examinerStr',
    }, {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
    }];

    return (
		<div className="DutyComponent">
	        <Card title={title} extra={<a onClick={()=>this.showModal()}>{isShow?null:null}</a>}>
            <Collapse defaultActiveKey={['1']} onChange={this.callback}>
              <Panel header={<Tag color="#2db7f5">基本信息</Tag>}  key="1">
              
                  <Table dataSource={baseData} columns={baseColumns} pagination={false}/>
              
              </Panel>
              <Panel header={<Tag color="#2db7f5">自动打分</Tag>}  key="2">
                
                  <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title={<Tag color="#2db7f5">警犬训练</Tag>} 
                  
                  >
                    <Table dataSource={automaticData.dogTrain} columns={automaticColumns} pagination={false}  className='performanceTableForm'/>
                  </Card>
                  <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title={<Tag color="#2db7f5">警犬使用及执勤值班</Tag>} 
                  
                  >
                    <Table dataSource={automaticData.dogUse} columns={automaticColumns} pagination={false} className='performanceTableForm'/>
                  </Card>
                  <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title={<Tag color="#2db7f5">出勤考勤</Tag>} 
                  
                  >
                    <Table dataSource={automaticData.outdoor} columns={automaticColumns} pagination={false}  className='performanceTableForm'/>
                  </Card>
              
              </Panel>
              <Panel header={<Tag color="#2db7f5">自主打分</Tag>}  key="3">
                  
                    <Card
                      style={{ marginTop: 16 }}
                      type="inner"
                      title={<Tag color="#2db7f5">训练考核</Tag>} 
                    
                    >
                    
                      <EditableTable autonomyData={autonomyData.trainCheck} checkDate={checkDate} userId={record.userId} typeId={2}/>
                    </Card>
                    <Card
                      style={{ marginTop: 16 }}
                      type="inner"
                      title={<Tag color="#2db7f5">理化管理</Tag>} 
                    
                    >
                   
                      <EditableTable autonomyData={autonomyData.dailyManage} checkDate={checkDate} updateTotalScore={this.updateTotalScore}  userId={record.userId} typeId={4}/>
                    </Card>
              </Panel>
            </Collapse>
          </Card>
          <Form className="ant-advanced-search-form">
            <Modal
              title="绩效信息"
              visible={this.state.visible}
              onOk={this.cancelRank}
              onCancel={this.hideModal}
              loading={modalLoading} 
              okText="确认"
              cancelText="取消"
            >
          
              <Row gutter={24}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <FormItem label='原因：'  {...firstLayout} >
                        {getFieldDecorator('cancelReason',{
                        rules: [{ required: true, message: '请输入原因' },{ max: 300, message: '原因不超过300' }],
                        initialValue:""
                        })(
                            <Input.TextArea placeholder=""  autosize={{ minRows: 2, maxRows: 24 }} />
                        )}
                    </FormItem>
                </Col>     
              </Row>
          
            </Modal>
        </Form>
        <SubjectDetail subjectInfo={subjectInfo} checkDate={checkDate}  hideModal={this.hideModal} isSubjectDetail={isSubjectDetail}/>
	    </div>
    )
  }
}
export default Form.create()(RegisterEdit);


// WEBPACK FOOTER //
// ./src/components/admin/performance/Register/RegisterEdit.js