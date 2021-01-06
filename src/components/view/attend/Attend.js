import React, {Component} from 'react';
import {Row, Col, Card, Tag} from 'antd';
import {Route} from 'react-router-dom';
import AttendSearch from 'components/view/searchForm/attend/AttendSearch';
import AttendTable from 'components/view/tables/attend/AttendTable';

require('style/view/assess/officer.less');
class Attend extends Component {
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
    const {match} = this.props;
    return (
      <div className="Officer">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <AttendSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <AttendTable match={match} filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Attend;

// WEBPACK FOOTER //
// ./src/components/view/attend/Attend.js
