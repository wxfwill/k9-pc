import React, { Component } from 'react';
import { Row, Col, Card, Tag } from 'antd';
import { Route } from 'react-router-dom';
import GRTaskTable from './GridRaidTaskTable';
import GRTaskSearch from './GridRaidTaskSearch';

class GridRaidTaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null,
    };
  }
  handleLimit = (limit) => {
    console.log(limit);
    console.log('filter');
    this.setState({ limit });
  };
  render() {
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <GRTaskSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <GRTaskTable filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GridRaidTaskList;

// WEBPACK FOOTER //
// ./src/components/view/monitoring/GridRaid/GridRaidTaskList.js
