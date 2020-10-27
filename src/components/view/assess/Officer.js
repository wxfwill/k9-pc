import React,{ Component } from 'react';
import { Row, Col, Card} from 'antd';

import OfficerSearch from 'components/view/searchForm/OfficerSearch';
import OfficerTable from 'components/view/tables/assess/OfficerTable';

require('style/view/assess/officer.less');
class Officer extends Component{
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
      <div className="Officer">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card title="按条件搜索" bordered={false}>
                <OfficerSearch limit={this.handleLimit}/>
              </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <OfficerTable filter={this.state.limit}/>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Officer;


// WEBPACK FOOTER //
// ./src/components/view/assess/Officer.js