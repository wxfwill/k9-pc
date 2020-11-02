import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message,Modal,Form,Row,Col,Input} from 'antd';
import {Link} from 'react-router-dom';
import Immutable from 'immutable';
import { firstLayout,secondLayout} from 'components/view/common/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
const FormItem = Form.Item;
class HolidayTable extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      loading:false,
      pagination: {
        showSizeChanger:true,
  //      showQuickJumper :true,
        defaultCurrent:1
      },
      pageSize:10,
      currPage:1,
      visible: false,
      selectedRowKeys:[]
    }
    this.id = '';
  }
  
  showModal = (id) => {
    this.id = id;
    this.setState({
      visible: true,
    });
  }
  hideModal= (isOk)=> {
    let verify = isOk ? 1 : 2;
    this.props.form.validateFields((err, values) => {
      if(!err){
        let data = {
          id: this.id,
          verify: verify,
          opinion: values.remark
        }
        
        let _this=this;
        let {dataSource} = this.state;
        let newData=[];
        httpAjax('post',config.apiUrl+'/api/leaveRecord/verifyLeaveApply',data).then((res)=>{
          console.log(res)
          let { history } = _this.props;
          if(res.code == 0){
            message.success('操作成功！');
            newData = dataSource.filter(item => data.id !== item.id);
          //  history.push({ pathname: '/app/holiday/approve' });
            _this.setState({
              dataSource:newData
            })
          }
        })
      }
      
    })
    this.setState({
      visible: false,
    });
  }
  closeModal=()=>{
    this.setState({
      visible: false,
    });
  }
  handleCancel=()=>{
    this.hideModal(false);
  }
  handleOk=()=>{
    this.hideModal(true);
  }
  componentWillMount(){
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if(Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return
    }
    let filter = nextProps.filter;
    let _this = this;
    this.setState({filter:filter},function(){
      _this.fetch({
        pageSize:_this.state.pageSize,
        currPage:1,
        ...filter
      });
    })
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/leaveRecord/leaveListPage',{...params}).then((obj)=>{
      let res=obj.data;
      const pagination = { ...this.state.pagination };
      pagination.total =res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      this.setState({dataSource:res.list,loading:false,pagination})
    }).catch(function(error){
      console.log(error);
    })
  }
  handleTableChange=(pagination, filters, sorter)=>{
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current
    });
  }
  onSelectChange=(selectedRowKeys)=>{
    //console.log(selectedRowKeys)
    this.setState({selectedRowKeys})
  }
 
  
 addInfo=()=>{
    sessionStorage.setItem("formStatus",'add');
    sessionStorage.setItem("singleUserId","");
  }
  //查看
  viewDetail=(record)=>{
    sessionStorage.setItem("singleUserId",record.id);
    sessionStorage.setItem("formStatus",'view');
  }
  editInfo=(record)=>{
    sessionStorage.setItem("singleUserId",record.id);
    sessionStorage.setItem("formStatus",'edit');
  }
  getGroupName=(id)=>{
			switch(id){
				case 1:
				return '大队领导';
				case 2:
				return '一中队'; 
				case 3:
				return '二中队';
				case 4:
				return '三中队';
				case 5:
        return '四中队';
        case 6:
				return '五中队';
        default:id
			}			
	}
  render(){
    const {dataSource,loading,pagination,selectedRowKeys}=this.state;
    const { getFieldDecorator  } = this.props.form;
    const rowSelection = {
      onChange:this.onSelectChange,
      selectedRowKeys
    }
    const columns =[
      {
        title:'警员姓名',
        dataIndex:'name',
        key:'name'
      },{
        title:'所属中队',
        dataIndex:'groupId',
        key:'groupId' , 
        render:(text,record,index)=>{
          return <span>{this.getGroupName(record.groupId)}</span>
        }     
      },{
        title:'请假类型',
        dataIndex:'typeName',
        key:'typeName'   
      },{
        title:'开始时间',
        dataIndex:'leaveStartTime',
        key:'leaveStartTime'  ,
        render:(text,record,index)=>{
          return <span>{record.leaveStartTime?moment(record.leaveStartTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
        }
      },{
        title:'结束时间',
        dataIndex:'leaveEndTime',
        key:'leaveEndTime'  ,
        render:(text,record,index)=>{
          return <span>{record.leaveEndTime?moment(record.leaveEndTime).format("YYYY-MM-DD h:mm:ss"):'--'}</span>
        }
      },{
        title:'请假时长',
        dataIndex:'duration',
        key:'duration'  ,
      },{
        title:'请假事由',
        dataIndex:'remark',
        key:'remark'  ,
      },{
        title:'状态',
        dataIndex:'status',
        key:'status'  ,
        render:(text,record,index)=>{
          return <span>{record.status==0?'待审批':'已审批'}</span>
        }
      },{
        title:'操作',
        dataIndex:'id',
        key:'id',
        render:(text,record,index)=>{
          return <div>
              {/*<Link to={{pathname:'/app/holiday/approvalDetail', query: { editItem: record }}}>
              <span  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='eye' style={{margin:'0 10px', }} />查看</span>
              </Link>*/}

           
              <span  onClick={() => this.showModal(record.id)}  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='edit' style={{margin:'0 10px', }}  />审批</span>
                
           
            
                       
          </div>
        }
      }
    ]
    return (
		  <div>
				<Table  
          key="holidayList"
          dataSource={this.state.dataSource} 
          columns ={columns} loading={loading} 
          onChange={this.handleTableChange}
          pagination={pagination}
          bordered
          rowKey='id'
   //       rowSelection={rowSelection}
         />
         <Form className="ant-advanced-search-form">
        <Modal
          title="审批信息"
          visible={this.state.visible}
          onCancel={() => this.closeModal(false)}
          footer={[
            <Button key="back" onClick={this.handleCancel}>拒绝</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              同意
            </Button>,
          ]}
        >
      
          <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <FormItem label='审批意见：'  {...firstLayout} >
                    {getFieldDecorator('remark',{
                    rules: [{ max: 300, message: '审批意见不超过300' }],
                    initialValue:""
                    })(
                        <Input.TextArea placeholder=""  autosize={{ minRows: 2, maxRows: 24 }} />
                    )}
                </FormItem>
            </Col>     
          </Row>
       
        </Modal>
        </Form>
	    </div>
    )
  }
}
export default Form.create()(HolidayTable);
