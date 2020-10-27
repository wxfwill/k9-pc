import React ,{ Component } from 'react';
import { Table, Button , Tag , Badge, fileList, Icon, Popconfirm, message} from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import SubDetailTabe from './SubDetailTabe'
import Immutable from 'immutable';

const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');

class SubTable extends React.Component {
  constructor(props){
    super(props);
    this.state={
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
      pageSize:3,
      currPage:1,
      data:[],
      loading:false,
      filter:null,
      changeLeft:false,
      showDetail:false
    }
  }
  componentWillMount() {
    this.fetch();
  }
  componentWillReceiveProps(nextProps) {
    if(Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return
    }
    let filter = nextProps.filter;
    let isReset = util.method.isObjectValueEqual(nextProps,this.props);
    if(!isReset){
      let _this = this;
      this.setState({filter},function(){
        _this.fetch({
          pageSize:_this.state.pageSize,
          currPage:1,
          ...filter
        });
      })
    }
  }
  handleTableChange=(pagination, filters, sorter)=>{
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current,
        ...this.props.filter
    });
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/trainingSubject/getAllTrainingSubject',{...params}).then((res)=>{
      const pagination = { ...this.state.pagination };
      pagination.total =res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      this.setState({data:res.list,loading:false,pagination})
    }).catch(function(error){
      console.log(error);
    })
  }
  handleShow(){
    let _this = this;
    this.setState({
      changeLeft:false
    },function(){
      setTimeout(()=>{
        _this.setState({
          showDetail:false
        })
      },600)
    })
  }
  queryDetail=(data)=>{
    this.setState({
      detailTitle:data,
      showDetail:true,
      changeLeft:true
    })
  }
  queryEdit = (data) => {

  }
  delData = (data) => {
    message.success("删除成功");
    httpAjax('post', config.apiUrl+'/api/trainingSubject/deleteByIds', {id: data}).then((res) => {
      if(res.code == 0){
        this.fetch();
      }
    })
  }
  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render:id=>{
        return <Badge count={id} style={{minWidth: '50px',fontSize:'12px',height:'16px',lineHeight:'16px', backgroundColor: '#99a9bf' }} /> 
      }
    },{
      title: '训练科目',
      dataIndex: 'trainSubjectName',
      key: 'trainSubjectName'
    }, {
      title: '训练阶段',
      dataIndex: 'trainLevel',
      key: 'trainLevel',
      render:level=>{
        let levelNum = parseInt(level)-1;
        let levelArr = ['初级','中级','高级'];
        return levelArr[levelNum]
      }     
    },{
      title: '操作',
      dataIndex: 'key',
      key: 'key',
        render:(data)=>{
          return (
            <div>
              <span className="s-table-detail" onClick={()=>this.queryDetail(data)}>查看详情</span>
              <span className="s-table-edit s-table-mar30">
                <Link to={{pathname:`/app/drill/drillsubAdd`, query: {id: data}}}>编辑</Link>
              </span>
              <Popconfirm title='确认删除此条信息?' onConfirm={()=>this.delData(data)}>
                <span className="s-table-del">删除</span>
              </Popconfirm>
            </div>
          )
        }
    }];    
    return (
      <div>
        <div className="table-operations">
          <Button type="primary">
            <Link to={{pathname:`/app/drill/drillsubAdd`, query: {targetText:'新增' }}}>新建科目</Link>
          </Button>
        </div>
        <Table  loading={this.state.loading} columns={columns} rowKey='id' dataSource={this.state.data}  bordered pagination={this.state.pagination} onChange={this.handleTableChange}/>
        {this.state.showDetail?<SubDetailTabe handleShow={this.handleShow.bind(this)} caption={this.state.detailTitle} changeLeft={this.state.changeLeft}/>:null} 
      </div>
    );
  }
}
export default SubTable;




// WEBPACK FOOTER //
// ./src/components/view/tables/drill/SubTable.js