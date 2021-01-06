import React, {Component} from 'react';
import {Radio, Form, Input, Modal, Icon, Card, Spin, Tag, message, Row, Col, Affix} from 'antd';
import {tMap} from 'components/view/common/map';
import moment from 'moment';
const Search = Input.Search;
require('style/view/monitoring/mapModal.less');
const one = require('images/one.jpg');
const two = require('images/two.jpg');
const three = require('images/three.jpg');
class MapModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    };
    this.timer = null;
  }
  componentDidMount() {
    const _this = this;
    this.timer2 = setInterval(_this.getTime.bind(_this), 1000); //

    this.hideLoading();
  }
  getTime = () => {
    this.setState({
      time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    });
  };
  componentWillUnmount() {
    clearInterval(this.timer);
    this.setState = (state, callback) => {};
  }

  hideLoading() {
    const _this = this;
    setTimeout(() => {
      _this.setState({
        loading: false
      });
    }, 2000);
  }
  handleCancel() {
    this.props.onCancel();
  }

  render() {
    const {changeLeft} = this.props;
    const {time} = this.state;
    return (
      <div className="MapModal" style={{left: changeLeft ? '360px' : '100%', overflowY: scroll}}>
        <span className="cursor p-icon" onClick={this.handleCancel.bind(this)}>
          <Icon type="right" />
        </span>
        <div className="map-container" style={{overflowY: scroll}}>
          {/*  <Spin spinning={this.state.loading}>
           
          </Spin>

           <Card  
                style={{ minWidth: 720, width: '46%',height:'46%',maxWidth: 960, display: 'inline-block', margin: '0 20px 20px 0'}}
                bodyStyle={{padding: '15px 32px'}} >
             
            </Card>
            <Card  
                style={{  minWidth: 720, width: '46%',height:'46%',maxWidth: 960, display: 'inline-block', margin: '0 20px 20px 0'}}
                bodyStyle={{padding: '15px 32px'}} >
              
            </Card>
            <Card 
                style={{ minWidth: 720, width: '46%',height:'46%',maxWidth: 960, display: 'inline-block', margin: '0 20px 20px 0'}}
                bodyStyle={{padding: '15px 32px'}} >
           
            </Card>*/}

          <Row align="middle" type="flex">
            <Col span={12}>
              <img
                style={{
                  width: '100%',
                  padding: 12,
                  minHeight: 300,
                  maxHeight: 440,
                  border: '1px solid silver',
                  borderBottom: 0,
                  borderRight: 0
                }}
                src={one}
              />
              <Affix style={{position: 'absolute', top: '8%', left: '80%'}}>{time}</Affix>
            </Col>
            <Col span={12}>
              <img
                style={{width: '100%', padding: 12, minHeight: 300, maxHeight: 440, border: '1px solid silver'}}
                src={two}
              />
              <Affix style={{position: 'absolute', top: '8%', left: '80%'}}>{time}</Affix>
            </Col>
          </Row>

          <Row align="middle" type="flex">
            <Col span={12}>
              <img
                style={{width: '100%', padding: 12, minHeight: 300, maxHeight: 440, border: '1px solid silver'}}
                src={three}
              />
              <Affix style={{position: 'absolute', top: '8%', left: '80%'}}>{time}</Affix>
            </Col>
            <Col span={12}></Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default MapModal;

// WEBPACK FOOTER //
// ./src/components/view/drill/VideoModal.js
