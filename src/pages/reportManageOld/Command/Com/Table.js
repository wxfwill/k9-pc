import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message} from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';
import moment from 'moment';
class CommandTable extends Component{
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
        ...filter
      });
    })
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/command4w/queryList',{...params}).then((res)=>{
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
    let {filter} = this.state;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
      ...filter
    });
  }
  onSelectChange=(selectedRowKeys)=>{
    //console.log(selectedRowKeys)
    this.setState({selectedRowKeys})
  }
  //删除
  deleteCommand=(record,index)=>{
    let {pagination}=this.state;
    httpAjax('post',config.apiUrl+'/api/command4w/delete',{id:record.id}).then(res=>{
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
      message.warn("请选择要删除的场地信息")
    }else{
      httpAjax('post',config.apiUrl+'/api/train/deleteTranPlace',{ids:selectedRowKeys}).then(res=>{
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
        title:'记录时间',
        dataIndex:'recordTime',
        key:'recordTime',
        render: (record) => moment(record).format('YYYY-MM-DD')    
      },
      {
        title:'来源',
        dataIndex:'source',
        key:'source'        
      },
      {
        title:'类型',
        dataIndex:'type',
        key:'type',
        render:(text,record,index)=>{
          let typeVal='';
          switch (text) {
            case 1:
              typeVal='刑事案件';
              break;
            case 2:
              typeVal='搜爆安检';
              break;
            case 3:
              typeVal='日常事务';
              break;
            case 4:
              typeVal='会议';
              break;
            case 5:
              typeVal='领导交办';
              break;
            case 6:
              typeVal='日常诊疗';
              break;
            default:
              typeVal='';
              break;
          }
          return typeVal;
        }       
      },
      {
        title:'部门',
        dataIndex:'groupName',
        key:'groupName'        
      }, {
        title:'汇报人',
        dataIndex:'reportUserName',
        key:'reportUserName'        
      }, {
        title:'记录人',
        dataIndex:'recordUserName',
        key:'recordUserName'        
      },{
        title:'备注',
        dataIndex:'remark',
        key:'remark'        
      },{
        title:'操作',
        dataIndex:'opreation',
        render:(text,record,index)=>{
          // console.log(text, record, index)
          return <div>
            <span style={{cursor: "pointer",color:'#1890ff'}} onClick={()=>this.viewDetail(record)}>
              <Link to={{pathname:'/app/report/4wcommandDetail', query: { id: record.id,targetText:'查看' }}}>
               <span  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='eye' style={{margin:'0 10px', }} />查看</span>
              </Link>
            </span>
            <Link  to={{pathname:'/app/report/4wcommandEdit', query: { id: record.id,targetText:'编辑' }}}>
               <span  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='edit' style={{margin:'0 10px', }} />编辑</span>
            </Link>          
            <Popconfirm title='确认删除此场地信息?' onConfirm={()=>this.deleteCommand(record)}>
              <span  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='delete' style={{margin:'0 10px', }} />删除</span>
            </Popconfirm>            
          </div>
        }
      }
    ]
    return (
		  <div>
        <div style={{marginBottom:'20px'}}>
          <Button type='primary' style={{marginRight:'20px'}} onClick={this.addInfo}>
          <Link to={{pathname:'/app/report/4wcommandEdit', query: {targetText:'新增' }}}>新增</Link>
          </Button>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>*/}
          {/* <Button onClick={this.deleteMore}>批量删除</Button> */}
        </div>
				<Table  
          dataSource={this.state.dataSource} 
          columns ={columns} loading={loading} 
          onChange={this.handleTableChange}
          pagination={pagination}
          bordered
          rowKey='id'
      //    rowSelection={rowSelection}
         />
	    </div>
    )
  }
}
export default CommandTable;



// WEBPACK FOOTER //
// ./src/components/admin/reportManage/Command/Com/Table.js