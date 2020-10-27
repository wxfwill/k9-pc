import React from 'react';
import { Row, Col, Card} from 'antd';
import PerformanceTable from '../tables/performanceAppraisal/PerformanceTable.js';
import PerformanceSearch from '../searchForm/PerformanceSearch.js';
class PerformanceAppraisal extends React.Component{
	constructor(props){
		super(props);
	    this.state= {
	      limit:null
	    }		
	}
	handleSearch=(weekDate)=>{
		console.log(weekDate)
	}
	handleLimit= (limit)=>{
	    this.setState({limit});
	}	
	render(){
		return(
	      <div className="DutyComponent">
	        <Row gutter={24}>
	          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
	              <Card title="成绩查询与录入" bordered={false}>
	                <PerformanceSearch handleSearch={this.handleSearch} limit={this.handleLimit} />
	              </Card>
	          </Col>
	        </Row>
	        <Row gutter={24}>
	          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
	            <Card bordered={false}>
	              <PerformanceTable  filter={this.state.limit}/>              
	            </Card>
	          </Col>
	        </Row>
	      </div>
		)
	}
}
export default PerformanceAppraisal;


// WEBPACK FOOTER //
// ./src/components/admin/performanceAppraisal/Performance.js