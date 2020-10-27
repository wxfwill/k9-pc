import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message} from 'antd';
import {Link} from 'react-router-dom';
import Immutable from 'immutable';
import moment from 'moment';
import httpAjax from 'libs/httpAjax';
class DogTable extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      loading:false,
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
      pageSize:10,
      currPage:1,
      selectedRowKeys:[]
    }
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
      // console.log(filter, 'filter')
      _this.fetch({
        pageSize:_this.state.pageSize,
        currPage:1,
        ...filter,
      });
    })
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/cmdMonitor/listAssembleTask',{...params}).then((res)=>{
      const pagination = { ...this.state.pagination };
      pagination.total =res.data.totalCount;
      pagination.current = res.data.currPage;
      pagination.pageSize = res.data.pageSize;
      this.setState({dataSource:res.data.list,loading:false,pagination})
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
  //删除
  deleteDogs=(record,index)=>{
    let {pagination}=this.state;
    httpAjax('post',config.apiUrl+'/api/cmdMonitor/deleteAssembleTaskByIds',{ids:[record.id]}).then(res=>{
      if(res.code==0){       
        message.success("删除成功");
          this.fetch({
            pageSize: pagination.pageSize,
            currPage: pagination.current
          });
      }else{
        message.serror("删除失败")
      }
    })
  }
  //批量删除
  deleteMore=()=>{
    const {selectedRowKeys,pagination}=this.state;
    if(selectedRowKeys.length<1){
      message.warn("请选择要删除的集合点")
    }else{
      httpAjax('post',config.apiUrl+'/api/cmdMonitor/deleteAssembleTaskByIds',{ids:selectedRowKeys}).then(res=>{
        if(res.code==0){
          message.success("删除成功");
          this.fetch({
            pageSize: pagination.pageSize,
            currPage: pagination.current
          });          
        }else{
          message.error("删除失败");
        }
      })
    }
  }
  addInfo=()=>{
    sessionStorage.setItem("formStatus",'add');
    sessionStorage.setItem("dogId","");
  }
  //查看
  viewDetail=(record)=>{
    sessionStorage.setItem("dogId",record.id);
    sessionStorage.setItem("formStatus",'view');
  }
  editInfo=(record)=>{
    sessionStorage.setItem("dogId",record.id);
    sessionStorage.setItem("formStatus",'edit');
  } 
  render(){
    const {dataSource,loading,pagination,selectedRowKeys}=this.state;
    const rowSelection = {
      onChange:this.onSelectChange,
      selectedRowKeys
    }
    const columns =[
      {
        title:'序号',
        dataIndex:'id',
        width: 50,
        key:'id'
      },
      {
        title:'任务名称',
        dataIndex:'taskName',
        width: 150,
      },
      {
        title:'集合地点 ',
        dataIndex:'location',
        width: 350,
      },{
        title:'集合人员',
        dataIndex:'userNames',
        key:'userNames'
      },{
        title:'上报人员',
        dataIndex:'reportUserName',
        key:'reportUserName',
        render: (record) => { return record ? record.reportUserName : '--'}         
      },{
        title:'集合时间 ',
        width: 200,
        dataIndex:'assembleTime',
        render: (record) => moment(record).format('YYYY-MM-DD HH:mm') 
      },{
        title:'发布时间 ',
        width: 200,
        dataIndex:'publishDate',
        render: (record) => { return record ? moment(record).format('YYYY-MM-DD HH:mm:ss') : '----'}        
      },{
        title:'发布人 ',
        width: 150,
        dataIndex:'operator',
        render: (record) => { return record ? record.operator : '--'}         
      },{
        title:'操作',
        width: 150,
        dataIndex:'opreation',
        render:(text,record,index)=>{
          // console.log(text, record, index)
          return <div>
            {/* <span style={{cursor: "pointer",color:'#1890ff'}} onClick={()=>this.viewDetail(record)}>
              <Link to={{pathname:'/app/uwb/listDetail', query: { VideoId: record.id,targetText:'查看' }}}>查看</Link>
            </span>
            <Link  to={{pathname:'/app/uwb/listEdit', query: { VideoId: record.id,targetText:'编辑' }}}>
              <Icon type='edit'   style={{cursor: "pointer",color:'#1890ff',margin:'0 10px'}}
               // onClick={()=>this.editInfo(record)}
               />
            </Link>           */}
            <Popconfirm title='确认删除此集合点信息?' onConfirm={()=>this.deleteDogs(record)}>
            <span  style={{cursor: "pointer",}} ><Icon type='delete' style={{margin:'0 10px', }} />删除</span>
            </Popconfirm>            
          </div>
        }
      }
    ]
    return (
		  <div>
        <div style={{marginBottom:'20px'}}>
          <Button type='primary' style={{marginRight:'20px'}} onClick={this.addInfo}>
          <Link to={{pathname:'/app/monitoring/assembleAdd', query: {targetText:'新增' }}}>新增集合点</Link>
          </Button>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>*/}
          <Button onClick={this.deleteMore}>批量删除</Button>
        </div>
				<Table  
          dataSource={this.state.dataSource} 
          columns ={columns} loading={loading} 
          onChange={this.handleTableChange}
          pagination={pagination}
          bordered
          rowKey='id'
          rowSelection={rowSelection}
         />
	    </div>
    )
  }
}
export default DogTable;
