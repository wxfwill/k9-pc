import React ,{ Component } from 'react';
import { Table, Button , Tag , Badge , Icon} from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';
import AttendDetail from './AttendDetail';
const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');
class AttendTable extends React.Component {
  constructor(props){
    super(props);
    this.state={
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
      pageSize:10,
      currPage:1,
      data:[],
      filter:null,
      loading:false,
      queryId:'',
      changeLeft:false,
      showDetail:false,
      statisticsTime:''
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
      ...this.state.filter
    });
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/leaveRecord/attendanceStatisticsList',{...params}).then((res)=>{
      const pagination = { ...this.state.pagination };
      pagination.total =res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      this.setState({data:res.list,loading:false,pagination})
    }).catch(function(error){
      console.log(error);
    })
  }
  queryDetail=(data,statisticsTime)=>{
    this.setState({
      queryId:data,
      showDetail:true,
      changeLeft:true,
      statisticsTime
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
  getColumns(){
    let _this = this;
    const columns = [
      {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },{
        title: '警号',
        dataIndex: 'number',
        key: 'number',
      }, {
        title: '事假（天）',
        dataIndex: 'compassionateLeaveDays',
        key: 'compassionateLeaveDays',        
      },{
        title: '调休假（天）',
        dataIndex: 'offDays',
        key: 'offDays'
      }, {
        title: '年假（天）',
        dataIndex: 'annualLeaveDays',
        key: 'annualLeaveDays'
      }, {
        title: '总计（天）',
        dataIndex: 'totalDays',
        key: 'totalDays'
      },{
        title: '查看',
        dataIndex: 'userId',
        key: 'userId',
        render:function(userId,record){
          let { statisticsTime } = record;
          return <span style={{color:'#1890ff',cursor: 'pointer'}} onClick={_this.queryDetail.bind(this,userId,statisticsTime)}>查看详情</span>
        }
    }];
    return columns;
  }
  render() {
    const { match } = this.props;
    return (
      <div>
        <Table  loading={this.state.loading} columns={this.getColumns()} dataSource={this.state.data}  bordered pagination={this.state.pagination} onChange={this.handleTableChange}/>
        {this.state.showDetail?<AttendDetail handleShow={this.handleShow.bind(this)} userId={this.state.queryId} statisticsTime={this.state.statisticsTime}changeLeft={this.state.changeLeft}/>:null}
      </div>
    );
  }
}
export default AttendTable;




// WEBPACK FOOTER //
// ./src/components/view/tables/attend/AttendTable.js