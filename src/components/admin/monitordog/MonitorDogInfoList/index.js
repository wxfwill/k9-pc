import React, {Component} from 'react';
import {Row, Col, Card, Button} from 'antd';
import HouseList from 'components/admin/monitordog/MonitorDogInfoList/list';
import FileterSearch from 'components/admin/monitordog/MonitorDogInfoList/search';

class DogInfo extends Component {
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
            <Card title="按条件查看" bordered={false}>
              <FileterSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <HouseList filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default DogInfo;
