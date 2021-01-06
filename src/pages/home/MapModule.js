import React, {Component} from 'react';

import {setMap} from './chart/chartConfig';
// const echarts = require('echarts');
const echarts = require('echarts/lib/echarts');

require('./cityData/shenshen');

class MapModule extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.showChart();
  }
  componentWillReceiveProps(nextProps) {
    var _this = this;
    var compareChart = echarts.getInstanceByDom(this.mapNode);
    if (typeof compareChart !== 'undefined') {
      compareChart.clear();
      _this.showChart();
      return;
    }
    _this.showChart();
  }
  showChart() {
    setMap(echarts, this.mapNode);
  }
  render() {
    return (
      <div
        style={{height: '400px', margin: '0px', boxSizing: 'border-box', paddingRight: '13%'}}
        className="map-module"
        ref={(mapNode) => {
          this.mapNode = mapNode;
        }}></div>
    );
  }
}

export default MapModule;
