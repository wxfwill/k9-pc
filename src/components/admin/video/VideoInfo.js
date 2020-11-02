import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Form, Input, Icon, Radio, DatePicker, Button, Select, Upload, message, Modal } from 'antd';
import { firstLayout, secondLayout } from 'util/Layout';
import httpAjax from 'libs/httpAjax';
import moment from 'moment';
require('style/app/dogInfo/addDogForm.less');

export default class AddVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    debugger;
    console.log(this.props, 'asdasdq');
    return <div className="AddDogForm">daisdqhiwuhas</div>;
  }
}

// WEBPACK FOOTER //
// ./src/components/admin/video/VideoInfo.js
