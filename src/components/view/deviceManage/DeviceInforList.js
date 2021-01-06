import React, {Component} from 'react';
import {Row, Col, Card} from 'antd';

import DeviceInforSearch from 'components/view/searchForm/DeviceInforSearch';
import DeviceInforTable from 'components/view/tables/DeviceInforTable';

class DeviceInforList extends Component {
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
              <DeviceInforSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <DeviceInforTable filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DeviceInforList;

// WEBPACK FOOTER //
// ./src/components/view/deviceManage/DeviceInforList.js
