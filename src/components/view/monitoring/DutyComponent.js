import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';

import Conduct from 'components/view/searchForm/Conduct';
import ConductTable from 'components/view/tables/ConductTable';

class DutyComponent extends Component {
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
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <Conduct limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <ConductTable filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DutyComponent;

// WEBPACK FOOTER //
// ./src/components/view/monitoring/DutyComponent.js
