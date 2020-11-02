import React,{ Component } from 'react';
import { Row, Col, Card , Tag} from 'antd';
import { Route } from 'react-router-dom';
import WorkLogSearch from './WorkLogSearch';
import WorkLogTable from './WorkLogTable';

require('style/view/assess/officer.less');
class WorkLog extends Component{
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
    const { match } = this.props; 
    return (
      <div className="Officer">
    {/*   <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card title='按条件搜索' bordered={false}>
                <WorkLogSearch limit={this.handleLimit}/>
              </Card>
          </Col>
        </Row>*/} 
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <WorkLogTable match={match} filter={this.state.limit}/>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default WorkLog;












// WEBPACK FOOTER //
// ./src/components/admin/reportManage/WorkLog/index.js