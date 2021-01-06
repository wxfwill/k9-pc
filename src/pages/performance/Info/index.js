import React, {Component} from 'react';
import {Row, Col, Card, Button} from 'antd';
import RegisterTable from './Table';
import RegisterSearch from './Search';
import {withRouter} from 'react-router-dom';
class PerformanceRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null
    };
  }
  handleLimit = (limit) => {
    this.setState({limit});
  };
  componentWillUnmount() {
    this.setState = (state, callback) => {};
  }
  componentDidMount() {
    React.store.dispatch({type: 'NAV_DATA', nav: ['绩效考核', '考核列表']});
  }
  render() {
    return (
      <div className="DutyComponent">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card title="按条件搜索" bordered={false}>
              <RegisterSearch limit={this.handleLimit} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <RegisterTable filter={this.state.limit} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default withRouter(PerformanceRegister);
