import React,{Component} from 'react';
import { Row, Col, Card, Tooltip, Icon, Radio ,Badge} from 'antd';
import httpAjax from 'libs/httpAjax';
class DutyCard extends Component{
	constructor(props){
		super(props)
		this.state={
      opDate:'',
      dayOfWeek:'',
      onDutyLeaderName:'',
      onDutyPoliceName:'',
      onDutyUserName:'',
      onDutyViceUserName:'',
      disinfectUsersName:'',
    }
	}
	componentWillMount() {
    let _this = this;
    httpAjax('post',config.apiUrl+'/api/onDuty/getTodayOnDuty').then((res)=>{
      if(res.code==0){
        let {dayOfWeek,onDutyLeaderName,onDutyPoliceName,onDutyUserName,onDutyViceUserName,disinfectUsersName}=res.data;
        let date = new Date(res.data.opDate).toLocaleString().split(' ')[0].split('/');
        _this.setState({
          dayOfWeek,
          onDutyLeaderName,
          onDutyPoliceName,
          onDutyUserName,
          onDutyViceUserName,
          disinfectUsersName,
          opDate:date[0]+'年'+date[1]+'月'+date[2]+"日"
        })
      };
    }).catch((error)=>{
      console.log(error)
    })
  }
	render(){
		return(
			<Card title={this.state.opDate} extra={this.state.dayOfWeek}  hoverable>
        <p><span>带班领导：</span>{this.state.onDutyLeaderName}</p>
        <p><span>值班：</span>{this.state.onDutyUserName}</p>
        <p><span>副班：</span>{this.state.onDutyViceUserName}</p>
        <p><span>值班辅警：</span>{this.state.onDutyPoliceName}</p>
        <Tooltip placement="right" title={this.state.disinfectUsersName}>
        	<p><span>本周消毒人员：</span>{this.state.disinfectUsersName}</p>
        </Tooltip>
      </Card>
		)
	}
}

export default DutyCard;