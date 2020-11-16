import React ,{ Component } from 'react';
import { Table, Button , Tag , Badge} from 'antd';
import { Link } from 'react-router-dom';
const localSVG = require('images/banglocation.svg');

const columns = [{
    dataIndex: 'userName',
    key: 'userName'
  }];

class GridTaskTaskInfoListView extends React.Component {
  constructor(props){
    super(props);
    var _t=this.props.taskID;
    this.state={
      taskID:_t
    }
  }
  componentWillMount() {
    this.fetch();
  }
 
  fetch(params = {taskId:this.state.taskID}){

    Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    var me=this;
    this.setState({ loading: true });
    React.$ajax.postData('/api/cmdMonitor/getTaskById',{...params,...this.state.filter}).then((res)=>{
       var ti=res.data;
       var gmtCreate = new Date(ti.createDate);
       var taskDate = new Date(ti.taskDate);
       ti.gmtCreate=gmtCreate.Format("yyyy-MM-dd hh:mm:ss");    
       ti.taskDate=taskDate.Format("yyyy-MM-dd hh:mm:ss");
       ti.publishDate = ti.publishDate ? new Date(ti.publishDate).Format("yyyy-MM-dd hh:mm:ss") : '----'
        
      this.setState({taskInfo:ti,loading:false});
    }).catch(function(error){
      me.setState({loading:false});
      alert("系统出现异常,请稍后重试！！！");
    })
  }

  render() {
    if(!this.state.taskInfo){
      return <div></div>;
    } 
    
    var ti=this.state.taskInfo;
    let taskReportInfo=ti.taskReportInfo
    return (
      <div style={{ maxHeight: '700px',marginLeft:18}}>
        <p><span>任务名称：</span>{ti.taskName  || "--"}</p>
        <p><span>创建时间：</span>{ti.gmtCreate  || "--"}</p>
        <p><span>执行时间：</span>{ti.taskDate  || "--"}</p>
        <p><span>发布时间：</span>{ti.publishDate  || "--"}</p>
        <p><span>发布人员：</span>{ti.operator  || "--"}</p>
        <p><span>任务内容：</span>{ti.content  || "--"}</p>
        <p><span>上报人员：</span>{ti.reportUserName || "--"}</p>
        <p><span>上报状态：</span>{taskReportInfo? taskReportInfo.status==0?'未上报':'已上报'||"--": "--"}</p>
        <p><span>查缉区域：</span>{taskReportInfo? taskReportInfo.palce||"--": "--"}</p>
        <p><span>分局名称：</span>{taskReportInfo? taskReportInfo.substation||"--": "--"}</p>
        {(taskReportInfo&&taskReportInfo.commentList.length>0)&&taskReportInfo.commentList.map((comment)=>
           <p key={comment.id}><span>{comment.commentName}：</span>{comment.number}</p>
        )}
        <p><span>任务反馈：</span>{taskReportInfo? taskReportInfo.remark||"--": "--"}</p>
      </div>
    );
  }
}
export default GridTaskTaskInfoListView;




// WEBPACK FOOTER //
// ./src/components/view/monitoring/GridRaid/GridTaskTaskInfoListView.js