import React ,{ Component } from 'react';
import { Table, Button , Tag , Badge , Icon} from 'antd';
import { Link } from 'react-router-dom';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';
import OfficerDetail from './OfficerDetail';
import 'style/view/common/deployTable.less'
const localSVG = require('images/banglocation.svg');

class OfficerTable extends React.Component {
  constructor(props){
    super(props);
    this.state={
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
      pageSize:7,
      currPage:1,
      data:[],
      loading:false,
      filter:null,
      yearMonth:'2018-02',
      detailTitle:'',
      changeLeft:false,
      showDetail:false
    }
  }
  componentWillMount() {
    this.fetch();
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
          yearMonth: this.state.yearMonth,
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
      yearMonth: this.state.yearMonth
    });
  }
  fetch(params = {pageSize:this.state.pageSize,currPage:this.state.currPage}){
    this.setState({ loading: true });
    httpAjax('post',config.apiUrl+'/api/trainCheck/listData',{...params}).then((res)=>{
      const pagination = { ...this.state.pagination };
      pagination.total = res.totalCount;
      pagination.current = res.currPage;
      pagination.pageSize = res.pageSize;
      this.setState({data:res.list,loading:false,pagination,yearMonth:res.list[0].yearMonth});
    }).catch(function(error){
      console.log(error);
    })
  }
  queryDetail=(data)=>{
    this.setState({
      detailTitle:data,
      showDetail:true,
      changeLeft:true
    })
  }
  getColumns(){
    let _this = this;
    const columns = [{
      title: '考核年月',
      dataIndex: 'yearMonth',
      key: 'yearMonth'
    },{
      title: '训导员',
      dataIndex: 'userName',
      key: 'userName'
    }, {
      title: '训犬成绩',
      dataIndex: 'trainScore',
      key: 'trainScore'
    },{
      title: '警犬使用成绩',
      dataIndex: 'dogUseScore',
      key: 'dogUseScore'
    },{
      title: '军事化管理成绩',
      dataIndex: 'dailyScore',
      key: 'dailyScore'
    },{
      title: '主考人',
      dataIndex: 'examinerName',
      key: 'examinerName'
    },{
      title: '总成绩',
      dataIndex: 'totalScore',
      key: 'totalScore'
    },{
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render: (status)=>{
        return status==0?<Tag color="#f50">未审核</Tag>:<Tag color="#2db7f5">通过</Tag>
      }
    },{
      title: '操作',
      dataIndex: 'key',
      key: 'key',
      render:function(data){
        return <span style={{color:'#1890ff',cursor: 'pointer'}} onClick={_this.queryDetail.bind(this,data)}>查看详情</span>
      }
    }];
    return columns;
  }
  render() {   
    return (
      <div>
        <div className="table-operations">
          <Button style={{marginRight:'10px'}}>
            <Link to='/view/monitoring/deployAdd'><Icon type="area-chart"/>月度排名</Link>
          </Button>
          <Button >
            <Link to='/view/monitoring/deployAdd'><Icon type="area-chart"/>年度排名</Link>
          </Button>         
        </div>
        <Table  loading={this.state.loading} columns={this.getColumns()} dataSource={this.state.data}  bordered pagination={this.state.pagination} onChange={this.handleTableChange}/>
        {this.state.showDetail?<OfficerDetail handleShow={this.handleShow.bind(this)} caption={this.state.detailTitle} changeLeft={this.state.changeLeft}/>:null}
      </div>
    );
  }
}
export default OfficerTable;




// WEBPACK FOOTER //
// ./src/components/view/tables/assess/OfficerTable.js