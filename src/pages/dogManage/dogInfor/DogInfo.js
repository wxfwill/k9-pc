import React, {Component} from 'react';
import {Row, Col, Card, Button} from 'antd';
import DogTable from 'components/admin/tables/DogManage/DogInforTable';
import DogSearch from 'components/admin/searchForm/DogManage/DogInforSearch';

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
  componentDidMount() {}
  render() {
    let type = '';
    if (this.props.history.location.query) {
      type = this.props.history.location.query.type;
    }
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <DogSearch limit={this.handleLimit} type={type} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <DogTable filter={this.state.limit} type={type} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default DogInfo;

// WEBPACK FOOTER //
// ./src/components/admin/dogManage/dogInfor/DogInfo.js
