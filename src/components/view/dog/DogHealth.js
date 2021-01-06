import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';

import HealthSearch from 'components/view/searchForm/dog/HealthSearch';
import HealthTab from 'components/view/tables/dog/HealthTab';
require('style/view/assess/officer.less');
class DogHealth extends Component {
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
              <HealthSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <HealthTab filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DogHealth;

// WEBPACK FOOTER //
// ./src/components/view/dog/DogHealth.js
