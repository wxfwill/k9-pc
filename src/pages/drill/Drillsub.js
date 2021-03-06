import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';

import SubSearch from 'components/view/searchForm/drill/SubSearch';
import SubTable from 'components/view/tables/drill/SubTable';
require('style/view/assess/officer.less');
class Drillsub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null
    };
  }
  handleLimit = (limit) => {
    this.setState({limit});
  };
  render() {
    return (
      <div className="DutyComponent Officer">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <SubSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <SubTable filter={this.state.limit} pathname={this.props.location.pathname} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Drillsub;

// WEBPACK FOOTER //
// ./src/components/view/drill/Drillsub.js
