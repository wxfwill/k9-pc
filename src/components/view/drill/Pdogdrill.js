import React,{ Component } from 'react';
import { Row, Col, Card} from 'antd';

import PdogSearch from 'components/view/searchForm/drill/PdogSearch';
import PdogTable from 'components/view/tables/drill/PdogTable';

class Pdogdrill extends Component{
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
                <PdogSearch limit={this.handleLimit}/>
              </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <PdogTable filter={this.state.limit}/>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Pdogdrill;


// WEBPACK FOOTER //
// ./src/components/view/drill/Pdogdrill.js