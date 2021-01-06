import React, {Component} from 'react';
import {Radio, Form, Input, Modal, Icon, Card, Spin, Tag, message, Row, Col, Affix} from 'antd';
import {tMap} from 'components/view/common/map';
import moment from 'moment';
import 'style/view/monitoring/mapModal.less';
import locate from 'images/locate.png';
const Search = Input.Search;
//require('style/view/monitoring/mapModal.less');
//const locate = require('images/locate.png')

class LocateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.timer = null;
  }
  componentDidMount() {}

  componentWillUnmount() {
    this.setState = (state, callback) => {};
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
          <Card style={{margin: '0 20px 20px 0'}} bodyStyle={{padding: '15px 32px'}}>
            <img style={{width: '100%'}} src={locate} />
          </Card>
        </div>
      </div>
    );
  }
}

export default LocateModal;

// WEBPACK FOOTER //
// ./src/components/view/drill/LocateModal.js
