import React, {Component} from 'react';
import {Row, Col, Card, Button} from 'antd';
import DogTable from 'components/admin/tables/DogManage/NewDogCureTable';
import DogSearch from 'components/admin/searchForm/DogManage/DogCureSearch';
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
            <Card title="按条件搜索" bordered={false}>
              <DogSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <DogTable filter={this.state.limit} pathname={this.props.location.pathname} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default DogInfo;

// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogCure/DogCure.js
