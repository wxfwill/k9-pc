import React, { Component } from 'react';
import 'style/NoData/index.less';
const noImg = require('images/no-data.svg');

class NoData extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="no-data-wrap">
        <img className="no-logo" src={noImg} alt="无数据" />
        <div className="no-txt">暂无数据</div>
      </div>
    );
  }
}

export default NoData;
