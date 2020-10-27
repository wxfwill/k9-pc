import React,{ Component } from 'react';
import { Row, Col, Card, Icon} from 'antd';

import SmartSearch from 'components/admin/searchForm/ScheduleManage/SmartSearch';
import SmartTable from 'components/admin/tables/ScheduleManage/SmartSchedule/SmartTable';
import SmartList from 'components/admin/tables/ScheduleManage/SmartSchedule/SmartList';
require('style/app/scheduleManage/smartSchedule.less');
class SmartSchedule extends Component{
  constructor(props){
    super(props);
    this.state= {
      limit:null,
      showContent:false,
      showList:false
    }
  }
  handleLimit= (limit)=>{
    this.setState({limit,showContent:true});
  }
  iconCut(){
    this.setState({
      showList:!this.state.showList
    })
  }
  cutHeader(){
    return(
      <div className="cutHeader">
        <span>{this.state.showList?"智能列表":"智能表格"}</span>
    {/*智能表格展示方式的切换    {this.state.showList?<Icon type="bars"  className="cut-icon" onClick={this.iconCut.bind(this)}/>:<Icon type="appstore" className="cut-icon"onClick={this.iconCut.bind(this)}/>}*/}
      </div>
    )
  }
  render(){
    return (
      <div className="smart-schedule">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card title="智能排班" bordered={false}>
                <SmartSearch limit={this.handleLimit}/>
              </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              {this.state.showContent?
                <Row gutter={24}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24} className="cut-module">
                    <Card title={this.cutHeader()} bordered={true} bodyStyle={{width:0,height:0,display:'none'}}>
                    </Card>
                  </Col>
                </Row>
              :null}
              {this.state.showContent&&!this.state.showList?<SmartTable filter={this.state.limit}/>:null}
              {this.state.showContent&&this.state.showList?<SmartList filter={this.state.limit} />:null}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SmartSchedule;


// WEBPACK FOOTER //
// ./src/components/admin/scheduleManage/SmartSchedule.js