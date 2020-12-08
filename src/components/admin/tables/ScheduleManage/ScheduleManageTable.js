import React ,{ Component } from 'react';
import { Table, Button , Tag , Badge , Icon,Input, Popconfirm,message,Spin } from 'antd';
import { Link } from 'react-router-dom';
import EditableCell from './EditableCell.js';
import 'style/app/editCell.less';
//import SmartSchedule from './SmartSchedule.js';
const localSVG = require('images/banglocation.svg');
require('style/view/common/deployTable.less');
class ScheduleManageTable extends React.Component {
  constructor(props){
    super(props);
    this.state={
      datas:[],
      dataSource:[],
      loading:false,
      dataSourceTitle:[],
      searchWeek:this.props.searchWeek,
      editLoading:false
    }
  }
  componentWillReceiveProps(nextProps){
    const { searchWeek } = nextProps;
    const searchW=this.state.searchWeek;
    if(searchW!=searchWeek){
      if(searchWeek.dutyDates[0].monday.name && searchWeek.dutyDates[0].monday.name.indexOf("周")<=-1){
        searchWeek.dutyDates.unshift(this.state.dataSourceTitle)
      }
      this.resetRender(searchWeek);      
    }
  } 

  resetRender=(searchWeek)=>{
    let tHeaderData = searchWeek.dutyDates.shift();
    let rHeaderArr = [{
        title:"带班领导",
        id:2
      },{
        title:"值班",
        id:3
      },{
        title:"值班室（上午）",
        id:4
      },{
        title:"值班室（下午）",
        id:5
      },{
        title:"值班辅警",
        id:6
      },{
        title:"值班中队",
        id:7
      },{
        title:"备勤",
        id:8
      },{
        title:"战斗组",
        id:9
      },{
        title:"备注",
        id:10
      }] ;
      if(searchWeek.dutyDates[8]){
        searchWeek.dutyDates[8]={
          monday:{
            userId:null,
            name:searchWeek.remark
          }
        };
      }else{
        searchWeek.dutyDates.push({
          monday:{
            userId:null,
            name:searchWeek.remark
          }
        });
      }
     
    searchWeek.dutyDates.forEach((items,index)=>{
      items.rowHeader = rHeaderArr[index];
      items.key = index;
    });
    this.setState({
      datas:searchWeek.dutyDates,
      dataSourceTitle:tHeaderData
    }) 
  }
  componentWillMount() {
    const { searchWeek } = this.state;
      this.resetRender(searchWeek);      
  }
  onCellChange = (key, getTimer,dataIndex,childrenIndex) => {
    const {dataSourceTitle}=this.state;
    let groupId= (dataIndex==4 ? childrenIndex&&childrenIndex.groupId : dataIndex+1 );
    let options={
        userId:key&&key.split("&")[0],
        groupId:childrenIndex&&childrenIndex.groupId,
        dutyType:dataIndex+1,
        classId:childrenIndex&&childrenIndex.classId,
        opDate:getTimer
    }
    if(dataIndex==8){
      options={
          remark:childrenIndex&&childrenIndex.name,
          opDate:getTimer
      }
    }
    this.setState({editLoading:true});
    const editDutyUser=sessionStorage.getItem("editDutyUser");
    if(dataIndex==8 || (key!='')&&editDutyUser!=(key&&key.split("&")[1])){
        React.$ajax.postData('/api/onDuty/updateDuty', options).then((res) => {
          if(res.code==0 ){          
            message.success("更改成功");
            if(localStorage.getItem("getScheduleOption")){
              let getScheduleOption=JSON.parse(localStorage.getItem("getScheduleOption"));
              if(getScheduleOption){
                this.props.getScheduleData(getScheduleOption);      
              }
            }else{
              this.props.getScheduleData({})
            }        
          }
        }).catch((error)=>{
          console.log(error);
        });            
    }
    this.setState({editLoading:false})
  } 
  getColumns(){
    const {dataSourceTitle} = this.state;
    const renderContent=(text,record,index,children)=>{         
          const obj = {
              children:children,
              props: {},
            };   
            if (index === 1) {
              obj.props.rowSpan = 3;
            }else if(index === 2 || index==3){
              obj.props.rowSpan = 0;
            }
            if(index==8){
              obj.props.colSpan = 0;
            }  
            return obj;
    }
    const columns = [
      {
        title:'日期',
        dataIndex: 'rowHeader',
        key: 'rowHeader',
        render:(rowHeader,record,index)=>{
          const obj = {
            children:<span>{record.rowHeader&&record.rowHeader.title}</span>,
            props: {},
          };   
      
          return obj;
        }
      },{
        title:dataSourceTitle.monday&&dataSourceTitle.monday.name,
        dataIndex: 'monday',
        key: 'monday',
        render:(text,record,index)=>{
          let childrenText=text
          let obj = {
              children: typeof text=="undefined"?"":<EditableCell value={childrenText}   index={index}  rowHeader={record} onChange={(x)=>this.onCellChange(x,dataSourceTitle.monday.userId, index,childrenText)}/>,
              props: {},
            };   
            if(index==8){
              obj = {
                children: typeof text=="undefined"?"":<EditableCell value={childrenText}   index={index}  rowHeader={record} onChange={(x)=>this.onCellChange(x,dataSourceTitle.monday.userId, index,childrenText)}/>,
                props: {},
              }
              obj.props.colSpan = 7;
            } 
            return obj;            
          } 
      },{
        title:dataSourceTitle.tuesday&&dataSourceTitle.tuesday.name,
        dataIndex: 'tuesday',
        key: 'tuesday',
        render:(text,record,index)=>{
          let childrenText=text      
          const obj = {
              children: typeof text=="undefined"?"":<EditableCell value={childrenText}   index={index}  rowHeader={record} onChange={(x)=>this.onCellChange(x,dataSourceTitle.tuesday.userId, index,childrenText)}/>,
              props: {},
            };    
          if(index==8){
            obj.props.colSpan = 0;
          }     
          return obj;                      
        }
      },{
        title:dataSourceTitle.wednesday&&dataSourceTitle.wednesday.name,
        dataIndex: 'wednesday',
        key: 'wednesday',
        render:(text,record,index)=>{
          let childrenText=text
          const obj = {
              children: typeof text=="undefined"?"":<EditableCell value={childrenText}   index={index}  rowHeader={record} onChange={(x)=>this.onCellChange(x,dataSourceTitle.wednesday.userId, index,childrenText)}/>,
              props: {},
              };  
              if(index==8){
                obj.props.colSpan = 0;
              }            
            return obj;           
        }
      },{
        title:dataSourceTitle.thursday&&dataSourceTitle.thursday.name,
        dataIndex: 'thursday',
        key: 'thursday',
        render:(text,record,index)=>{
          let childrenText=text
          const obj = {
              children: typeof text=="undefined"?"":<EditableCell value={childrenText}   index={index}  rowHeader={record} onChange={(x)=>this.onCellChange(x,dataSourceTitle.thursday.userId, index)}/>,
              props: {},
            };   
            if(index==8){
              obj.props.colSpan = 0;
            }          
            return obj;           
        }
      },{
        title:dataSourceTitle.friday&&dataSourceTitle.friday.name,
        dataIndex: 'friday',
        key: 'friday',
        render:(text,record,index)=>{
          let childrenText=text
          const obj = {
            children: typeof text=="undefined"?"":<EditableCell value={childrenText}   index={index}  rowHeader={record} onChange={(x)=>this.onCellChange(x,dataSourceTitle.friday.userId, index)}/>,
            props: {},
          }; 
          if(index==8){
            obj.props.colSpan = 0;
          }            
          return obj;   
        }
      },{
        title:dataSourceTitle.saturday&&dataSourceTitle.saturday.name,
        dataIndex: 'saturday',
        key: 'saturday',
        render:(text,record,index)=>{
          let childrenText=text
          let  children = (typeof text=="undefined")?"":<EditableCell value={childrenText}   index={index}  rowHeader={record} onChange={(x)=>this.onCellChange(x,dataSourceTitle.saturday.userId, index)}/>;         
          return renderContent(text,record,index,children);
        }
      },{
        title:dataSourceTitle.sunday&&dataSourceTitle.sunday.name,
        dataIndex: 'sunday',
        key: 'sunday',
        render:(text,record,index)=>{
          let childrenText=text
          let children=(typeof text=="undefined")?"":<EditableCell value={childrenText}   index={index}  rowHeader={record} onChange={(x)=>this.onCellChange(x,dataSourceTitle.sunday.userId, index)}/>;
          return renderContent(text,record,index,children)
        }
      }
    ]
    return columns;
  }

  //导出
  expWeekDuty=()=>{
    let dateString=localStorage .getItem("ChangeWeek");
    const  reqUrl=config.apiUrl+'/api/onDuty/expWeekDuty';
    if(dateString){
      let ChangeWeek=dateString.replace(/周/, "");
      let options={
        year:ChangeWeek.split("-")[0],
        week:ChangeWeek.split("-")[1]
      }
      window.location.href=config.apiUrl+'/api/onDuty/expWeekDuty?year='+options.year+"&week="+options.week;
   //   httpAjax('post',reqUrl,options).then((res)=>{});         
    }else{
      window.location.href=config.apiUrl+'/api/onDuty/expWeekDuty';
    }

  }

  render() {
    const { datas ,editLoading}=this.state; 
    const antIcon = <Icon type="loading" style={{ fontSize: 30 }} spin />  
    return (
      <div>
        <div className="table-operations" style={{textAlign:'left'}}>
            <Button type='primary' ><Link to='/app/duty/dutyWeekSchedule'>智能排班</Link></Button>&nbsp;&nbsp;
            <Button onClick={this.expWeekDuty.bind(this)} >导出</Button>
        </div>
        <Table className='scheduleContent' loading={this.state.loading} columns={this.getColumns()} dataSource={datas}  bordered     pagination={false} />
        {editLoading ?<div style={{position:'fixed',top:'10%',left:'50%'}}><Spin indicator={antIcon}   /></div>  : ''}        
      </div>
    );
  }
}
export default ScheduleManageTable;


// WEBPACK FOOTER //
// ./src/components/admin/tables/ScheduleManage/ScheduleManageTable.js