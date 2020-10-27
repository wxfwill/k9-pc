import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';

import SubSearch from 'components/view/searchForm/drill/PlanSearch';
import SubTable from 'components/view/tables/drill/PlanTable';
require('style/view/assess/officer.less');
class DrillPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null,
    };
  }
  handleLimit = (limit) => {
    this.setState({ limit });
  };
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
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

export default DrillPlan;
