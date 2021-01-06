import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';

import PrevSearch from 'components/view/searchForm/dog/PrevSearch';
import PrevTable from 'components/view/tables/dog/PrevTable';
require('style/view/assess/officer.less');
class DogPrev extends Component {
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
              <PrevSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <PrevTable filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DogPrev;

// WEBPACK FOOTER //
// ./src/components/view/dog/DogPrev.js
