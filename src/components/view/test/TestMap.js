import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import * as systomState from 'actions/systomStatus';
import {Row, Col, Icon, Spin, Button, Table, Card, Collapse, Badge, Tag} from 'antd';
import {tMap} from 'components/view/common/map';
import httpAjax from 'libs/httpAjax';

const Panel = Collapse.Panel;
const antIcon = <Icon type="loading" style={{fontSize: 30}} spin />;

require('style/view/monitoring/gridRaid.less');
class TestMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: null,
      loading: true
    };
  }
  componentWillMount() {
    const _this = this;
    const {unfold} = this.props.systomActions;
    unfold(true);
  }
  componentDidMount() {
    const _this = this;
    this.timmer = setTimeout(function () {
      _this.setState({
        loading: false
      });
    }, 1000);
    const options = {
      labelText: '我的位置'
    };
    const TMap = new tMap(options);
    this.drawing(function (data) {
      TMap.drawingLine(data);
    });
  }
  componentWillUnmount() {
    clearTimeout(this.timmer);
  }
  drawing(callback) {
    httpAjax('post', config.apiUrl + '/api/test/jwd ')
      .then((res) => {
        const {code, data} = res;
        const latArr = [];
        const lngArr = [];
        if (code == 0) {
          data.length > 0 && callback(data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const {collapsed} = this.props.systomState;
    return (
      <div className="GridRaid" style={{left: collapsed ? '92px' : '212px'}}>
        <Spin
          indicator={antIcon}
          size="large"
          tip="数据加载中..."
          spinning={this.state.loading}
          style={{position: 'absolute', top: '50%', left: '50%', zIndex: '9999'}}
        />
        <Row gutter={24} id="container"></Row>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  systomState: state.system
});
const mapDispatchToProps = (dispatch) => ({
  // systomActions: bindActionCreators(systomState,dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TestMap);

// WEBPACK FOOTER //
// ./src/components/view/test/TestMap.js
