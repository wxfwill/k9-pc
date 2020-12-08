import React from 'react';
import { Table ,Tag ,Button ,Progress ,message} from 'antd';
import StableEdit from './StableEdit';
import Immutable from 'immutable';
require('style/app/scheduleManage/smartTable.less');
class SmartTable extends React.Component{
	constructor(props){
		super(props);
    this.state = {
      percent: 0,
      data:[],
      showTable:false,
      tableHeader:null,
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
      loading:false
    }
    this.timer = null;
	}
  componentDidMount() {
    this.timming();
  }
  timming(limitData,isFirst){
    let _this = this;
    this.timer = setInterval(function(){
      _this.setState({
        percent:_this.state.percent<130?_this.state.percent+1:110
      },function(){
        if(_this.state.percent==110){
          clearInterval(_this.timer);
          if(typeof limitData=='undefined'){
            _this.fetch({startDate:_this.props.filter.startTime,endDate:_this.props.filter.endTime,currPage:1},true)
          }else{
            _this.fetch({startDate:limitData.startTime,endDate:limitData.endTime,currPage:1},isFirst)
          }
        }
      })
    },10)
  }
  componentWillReceiveProps(nextProps) {
    if(Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return
    }
    let { filter } = nextProps;
    if(!(this.props.filter.startTime==filter.startTime&&this.props.filter.endTime==filter.endTime)){
      this.setState({
        percent:0
      },function(){
        this.timming(filter,true);
      })
    };
  }
  handleTableChange=(pagination, filters, sorter)=>{
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      startDate:this.props.filter.startTime,
      endDate:this.props.filter.endTime,
      currPage: pagination.current,
    });
  }
  fetch(params,isFirst){
    let _this = this;
    // let reqUrl = isFirst?config.apiUrl+'/api/onDuty/genDuty':config.apiUrl+'/api/onDuty/getDutyByPage';
    let reqUrl = isFirst?'/api/onDuty/genDuty':'/api/onDuty/getDutyByPage';
    this.setState({ loading: true });
    React.$ajax.postData(reqUrl, {...params}).then((res)=>{
      let { data } = res;
      const pagination = { ...this.state.pagination };
      pagination.total = data.totalCount*9;
      pagination.current = data.currPage;
      pagination.pageSize = data.pageSize*9;
      _this.handleData(pagination,data.list,function(pagination,tableHeader,data){
        _this.setState({data,tableHeader,showTable:true,loading:false,pagination});
      });
    }).catch(function(error){
      console.log(error);
    })
  }
  handleData(pagination,data,callBack){
    let tableData = data[0];
    let tableHeader = tableData.dutyDates.shift(0);
    let columnsHeader = [
    {
      userName:"带班领导",
      userId:2
    },{
      userName:"值班",
      userId:3
    },{
      userName:"值班室（上午）",
      userId:4
    },{
      userName:"值班室（下午）",
      userId:5
    },{
      userName:"值班辅警",
      userId:6
    },{
      userName:"值班中队",
      userId:7
    },{
      userName:"备勤",
      userId:8
    },{
      userName:"战斗组",
      userId:9
    },{
      userName:"备注",
      userId:10
    }
  ]
    tableData.dutyDates.push({
      monday:{
        userId:null,
        userName:tableData.remark
      }
    })
    tableData.dutyDates.length>0&&tableData.dutyDates.forEach((item,index)=>{
      item.key=index+'key';
      item.columnsHeader=columnsHeader[index];
    })
    callBack(pagination,tableHeader,tableData.dutyDates);
  }
  handleTableData(day,row,index,colHeader,week){
    let obj =  {
      children: typeof day!=="undefined"?<StableEdit value={day.name} userId={day.userId+"&"+day.groupId+"&"+day.classId} rowNumber={index+1}  onChange={this.handleDataChange} udTime={colHeader.userId}></StableEdit>:'',
      props:{},
    };
    if(week=='saturday'||week=='sunday'){
      if (index === 1) {
        obj.props.rowSpan = 3;
      }else if(index === 2 || index==3){
        obj.props.rowSpan = 0;
      }
    }
    if (index < 8) {
      return obj;
    }else{
      obj.props.colSpan=0;
      return obj;
    }
  }
  handleDataChange(options,hide){
    React.$ajax.postData('/api/onDuty/updateDuty', {...options}).then((res)=>{
      if(res.code==0){
        hide();
        message.success('更改成功！',1);
      };
    }).catch((error)=>{
      hide();
      message.error('服务端错误',1);
      console.log(error);
    })
  }
	getColumns(tableHeader){
    let _this = this;
    const columns = [{
      title: '日期',
      dataIndex: 'columnsHeader',
      key: 'columnsHeader',
      render:(columnsHeader)=>{
        return columnsHeader.userName
      }
    }, {
      title:tableHeader.monday.name,
      dataIndex: 'monday',
      key: 'monday',
      render:(monday, row, index)=>{
      /*  if (index < 4) {
          return typeof monday!=="undefined"?<StableEdit value={monday.name} userId={monday.userId}udTime={tableHeader.monday.userId} rowNumber={index+1}  onChange={this.handleDataChange}></StableEdit>:'';
        }else if(index==4){
          let disArr = [];
          typeof monday!=='undefined'&&Object.keys(monday).forEach((item,indexs)=>{
            Array.prototype.push.call(disArr,<StableEdit value={monday[item].name} userId={monday[item].userId} udTime={tableHeader.monday.userId} rowNumber={index+indexs+1} key={Math.random()+index} onChange={this.handleDataChange}></StableEdit>);
          })
          return {
            children: disArr.length>0&&disArr,
            props: {
              colSpan:7,
            },
          };
        }*/

        if(index<8){
          return {
            children: typeof monday!=="undefined"?<StableEdit value={monday.name} userId={monday.userId+"&"+monday.groupId+"&"+monday.classId} udTime={tableHeader.monday.userId}  rowNumber={index+1}  onChange={this.handleDataChange}/>:'',
            props: {
            },
          };
        }else{
          return {
            children: <span>{monday.name}</span>,
            props: {
              colSpan:7,
            },
          };
        }
       
      }
    }, {
      title:tableHeader.tuesday.name,
      dataIndex: 'tuesday',
      key: 'tuesday',
      render:(tuesday, row, index)=>{
        return _this.handleTableData(tuesday, row, index, tableHeader.tuesday);
      }
    }, {
      title:tableHeader.wednesday.name,
      dataIndex: 'wednesday',
      key: 'wednesday',
      render:(wednesday, row, index)=>{
        return _this.handleTableData(wednesday, row, index, tableHeader.wednesday);
      }
    }, {
      title:tableHeader.thursday.name,
      dataIndex: 'thursday',
      key: 'thursday',
      render:(thursday, row, index)=>{
        return _this.handleTableData(thursday, row, index, tableHeader.thursday);
      }
    }, {
      title:tableHeader.friday.name,
      dataIndex: 'friday',
      key: 'friday',
      render:(friday, row, index)=>{
        return _this.handleTableData(friday, row, index, tableHeader.friday);
      }
    }, {
      title:tableHeader.saturday.name,
      dataIndex: 'saturday',
      key: 'saturday',
      render:(saturday, row, index)=>{
        return _this.handleTableData(saturday, row, index, tableHeader.saturday,'saturday');
      }
    },{
      title:tableHeader.sunday.name,
      dataIndex: 'sunday',
      key: 'sunday',
      render:(sunday, row, index)=>{
        return _this.handleTableData(sunday, row, index, tableHeader.sunday,'sunday');
      }
    }];
		return columns;
	}
	render(){
		return(
			<div className="smart-table">
        <Progress type="circle" percent={this.state.percent} className="progress" width={150} style={{display:this.state.percent==110?'none':'block'}}/>
        {this.state.percent>100&&this.state.showTable?
          <Table loading={this.state.loading} columns={this.getColumns(this.state.tableHeader)} dataSource={this.state.data}  bordered pagination={this.state.pagination} onChange={this.handleTableChange}/>
        :null}
			</div>
		)
	}
}
export default SmartTable;


// WEBPACK FOOTER //
// ./src/components/admin/tables/ScheduleManage/SmartSchedule/SmartTable.js