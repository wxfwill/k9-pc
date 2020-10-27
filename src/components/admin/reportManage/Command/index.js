import React,{ Component } from 'react';
import { Row, Col, Card,Button} from 'antd';
import CommandTable from './Com/Table';
import CommandSearch from './Com/Search';
class Command extends Component{
  constructor(props){
    super(props);
    this.state= {
      limit:null
    }
  }
   handleLimit= (limit)=>{
    this.setState({limit});
  }
  render(){
    return (
		<div className="DutyComponent">
	        <Row gutter={24}>
	          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
	              <Card title="按条件搜索" bordered={false}>
	                <CommandSearch  limit={this.handleLimit}   />
	              </Card>
	          </Col>
	        </Row>
	        <Row gutter={24}>
	          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
	            <Card bordered={false}>
	            	<CommandTable filter={this.state.limit} />
	            </Card>
	          </Col>
	        </Row>
	      </div>
    )
  }
}
export default Command;



// WEBPACK FOOTER //
// ./src/components/admin/reportManage/Command/index.js