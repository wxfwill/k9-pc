import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';

import DailyFeedSearch from 'components/view/searchForm/dog/DailyFeedSearch';
import DailyFeedTable from 'components/view/tables/dog/DailyFeedTable';

class DogFeed extends Component {
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
              <DailyFeedSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <DailyFeedTable filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DogFeed;

// WEBPACK FOOTER //
// ./src/components/view/dog/DogFeed.js
