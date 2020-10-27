import React,{ Component } from 'react';
import { Table,Button,Icon,Popconfirm,message} from 'antd';
import {Link} from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';
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
        uniqueNo: filter.uniqueNo,
        name: filter.name,
      });
    })
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/train/listTrainPlace',{...params}).then((res)=>{
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
  deleteDogs=(record,index)=>{
    let {pagination}=this.state;
    httpAjax('post',config.apiUrl+'/api/train/deleteTranPlace',{ids:[record.id]}).then(res=>{
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
        title:'名称',
        dataIndex:'name',
        key:'name'        
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
              <Link to={{pathname:'/app/basicData/trainPlaceDetail', query: { id: record.id,targetText:'查看' }}}>
               <span  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='eye' style={{margin:'0 10px', }} />查看</span>
              </Link>
            </span>
            <Link  to={{pathname:'/app/basicData/trainPlaceEdit', query: { id: record.id,targetText:'编辑' }}}>
               <span  style={{cursor: "pointer",color:'#1890ff'}} ><Icon type='edit' style={{margin:'0 10px', }} />编辑</span>
            </Link>          
            <Popconfirm title='确认删除此场地信息?' onConfirm={()=>this.deleteDogs(record)}>
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
          <Link to={{pathname:'/app/basicData/trainPlaceAdd', query: {targetText:'新增' }}}>新增场地</Link>
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



// WEBPACK FOOTER //
// ./src/components/admin/trainPlace/Com/Table.js