import React, { Component } from 'react';
import { Row, Col, Card, Tooltip, Icon, Radio, Button } from 'antd';

import Pandect from './pandect';
import MapModule from './MapModule';
import BarChart from './chart/BarChart';
import FooterCard from './FooterCard';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

require('style/view/page/index.less');
class IndexComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPic: false,
    };
  }
  showPandect() {
    let _this = this;
    this.setState(
      {
        showPic: !this.state.showPic,
      },
      function () {
        _this.state.showPic ? _this.requestFullScreen() : _this.exitFull();
      }
    );
  }
  requestFullScreen() {
    // 判断各种浏览器，找到正确的方法
    let element = document.documentElement;
    let requestMethod =
      element.requestFullScreen || //W3C
      element.webkitRequestFullScreen || //Chrome等
      element.mozRequestFullScreen || //FireFox
      element.msRequestFullScreen; //IE11
    if (requestMethod) {
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== 'undefined') {
      //for Internet Explorer
      let wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{F11}');
      }
    }
  }
  exitFull() {
    // 判断各种浏览器，找到正确的方法
    var exitMethod =
      document.exitFullscreen || //W3C
      document.mozCancelFullScreen || //Chrome等
      document.webkitExitFullscreen || //FireFox
      document.webkitExitFullscreen; //IE11
    if (exitMethod) {
      exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== 'undefined') {
      //for Internet Explorer
      var wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{F11}');
      }
    }
  }
  render() {
    return (
      <div className="IndexComponent">
        <Button
          onClick={this.showPandect.bind(this)}
          size="large"
          shape="circle"
          type="primary"
          style={{ position: 'absolute', top: '85px', right: '29px', zIndex: '9' }}
        >
          <Icon type="arrows-alt" />
        </Button>
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="犬只总数统计" bordered={true}>
              <Row justify="space-between" className="num-total">
                <Col md={{ span: 6 }} sm={12} xs={24}>
                  <Card className="card-num sum" hoverable bordered={false} title={<div>犬只总数</div>}>
                    <p>
                      <span style={{ fontSize: '35px' }}>297</span>头
                    </p>
                  </Card>
                </Col>
                <Col md={{ span: 6, offset: 3 }} sm={12} xs={24}>
                  <Card className="card-num go" hoverable bordered={false} title={<div>出勤犬只</div>}>
                    <p>
                      <span style={{ fontSize: '35px' }}>126</span>头
                    </p>
                  </Card>
                </Col>
                <Col md={{ span: 6, offset: 3 }} sm={12} xs={24}>
                  <Card className="card-num serve" hoverable bordered={false} title={<div>服役犬只</div>}>
                    <p>
                      <span style={{ fontSize: '35px' }}>26</span>头
                    </p>
                  </Card>
                </Col>
              </Row>
            </Card>
            <Row gutter={24}>
              <Row gutter={24}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  <RadioGroup
                    defaultValue="a"
                    size="large"
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}
                  >
                    <RadioButton style={{ flex: 1 }} value="a">
                      <Icon type="pie-chart" />
                      犬只分布
                    </RadioButton>
                    <RadioButton style={{ flex: 1 }} value="b">
                      <Icon type="wifi" />
                      外勤巡逻
                    </RadioButton>
                    <RadioButton style={{ flex: 1 }} value="c">
                      <Icon type="global" />
                      网格化搜捕
                    </RadioButton>
                  </RadioGroup>
                </Col>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  <Card>
                    <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                      <Card className="bd-n">
                        <MapModule />
                      </Card>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                      <Card className="bd-n area-number">
                        <p>南山区 ：120只</p>
                        <p>罗湖区 ：120只</p>
                        <p>福田区 ：120只</p>
                        <p>宝安区 ：120只</p>
                        <p>盐田区 ：120只</p>
                        <p>龙岗区 ：120只</p>
                        <p>光明新区 ：120只</p>
                      </Card>
                    </Col>
                  </Card>
                </Col>
              </Row>
            </Row>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={true}>
              <BarChart />
            </Card>
          </Col>
        </Row>
        <FooterCard />
        {this.state.showPic ? <Pandect show={this.state.showPic} handleShow={this.showPandect.bind(this)} /> : null}
      </div>
    );
  }
}
export default IndexComponent;
