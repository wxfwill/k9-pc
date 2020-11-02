import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message} from 'antd';
import {Link} from 'react-router-dom';
import Immutable from 'immutable';
import httpAjax from 'libs/httpAjax';
class UserTable extends Component{
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
      _this.fetch({
        pageSize:_this.state.pageSize,
        currPage:1,
        policeName:filter&&filter.policeName,
        policeNumber:filter&&filter.policeNumber,
        duty:filter&&filter.duty,
        title:filter&&filter.title
      });
    })
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/user/list',{...params}).then((res)=>{
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
    let {filter} = this.state;
    pager.current = pagination.current;
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
  //删除警员
  deleteUser=(record,index)=>{
    let dataSource=this.state.dataSource;
    httpAjax('post',config.apiUrl+'/api/user/deleteUserByIds',{ids:[record.id]}).then(res=>{
      if(res.code==0){       
        message.success("删除成功");
        dataSource.splice(index,1);
        this.setState({dataSource});
      }else{
        message.serror("删除失败")
      }
    })
  }
  //批量删除
  deleteMoreUsers=()=>{
    const {selectedRowKeys,pagination}=this.state;
    if(selectedRowKeys.length<1){
      message.warn("请选择要删除的警员")
    }else{
      httpAjax('post',config.apiUrl+'/api/user/deleteUserByIds',{ids:selectedRowKeys}).then(res=>{
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
  render(){
    const {dataSource,loading,pagination,selectedRowKeys}=this.state;
    const rowSelection = {
      onChange:this.onSelectChange,
      selectedRowKeys
    }
    const columns =[
      {
        title:'姓名',
        dataIndex:'name',
        key:'name'
      },{
        title:'性别',
        dataIndex:'sexStr'        
      },{
        title:'警员编号',
        dataIndex:'number'
      },{
        title:'职务',
        dataIndex:'dutyStr'
      },{
        title:'职称',
        dataIndex:'titleStr'
      },{
        title:'工作单位',
        dataIndex:'workUnit'
      },{
        title:'电话',
        dataIndex:'telPhone'
      },{
        title:'操作',
        dataIndex:'opreation',
        render:(text,record,index)=>{
          return <div>
             <span style={{cursor: "pointer",color:'#1890ff'}} onClick={()=>this.viewDetail(record)}>
              <Link to={{pathname:'/app/user/infoUserData', query: { userId: record.id,targetText:'查看' }}}>
              <span  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='eye' style={{margin:'0 10px', }} />查看</span>
              </Link>
            </span>
            {/*<Link to={{pathname:'/app/user/infoUserData', query: { userId: record.id,targetText:'查看' }}}>
              <Icon type='eye' />
            </Link>*/}
            <Link  to={{pathname:'/app/user/infoEditUser', query: { userId: record.id,targetText:'编辑' }}}>
              <span  style={{cursor: "pointer",color:'#1890ff'}} onClick={()=>this.editInfo(record)}><Icon type='edit' style={{margin:'0 10px', }}  />编辑</span>
            </Link>          
            <Popconfirm title='确认删除此警员?' onConfirm={()=>this.deleteUser(record,index)}>
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
            <Link to={{pathname:'/app/user/infoAddUser', query: {targetText:'新增' }}}>新增人员</Link>
          </Button>
          {/*<Button style={{margin:'0 20px'}}>导出</Button>*/}
          <Button onClick={this.deleteMoreUsers}>批量删除</Button>
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
export default UserTable;



// WEBPACK FOOTER //
// ./src/components/admin/tables/UserInfor/UserTable.js