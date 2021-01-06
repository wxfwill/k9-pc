import React, {Component} from 'react';
import {WorkBar} from './chartConfig';
import {Row, Col, Card} from 'antd';
import httpAjax from 'libs/httpAjax';
// const echarts = require('echarts')
const echarts = require('echarts/lib/echarts');
class WorkCharts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barData: []
    };
  }
  componentDidMount() {
    const _this = this;
    httpAjax('post', config.apiUrl + '/api/userCenter/getAttendanceStatus')
      .then((res) => {
        const {code, data} = res;
        if (code == 0) {
          const barData = [];
          Object.keys(data).forEach((item, index) => {
            Array.prototype.push.call(barData, data[item]);
          });
          _this.setState(
            {
              barData: barData.slice(0, 2)
            },
            function () {
              _this.showChart(echarts, this.workChart, _this.state.barData);
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // componentWillReceiveProps(nextProps) {
  //    var _this = this;
  //      var compareChart = echarts.getInstanceByDom(this.workChart);
  //      if(typeof compareChart !== 'undefined'){
  //        compareChart.clear();
  //        _this.showChart();
  //        return
  //      }
  //      _this.showChart();
  //  	}
  showChart(echart, workChart, barData) {
    WorkBar(echart, this.workChart, barData);
  }
  render() {
    return (
      <Card title={<span className="card-title">出勤状态栏</span>} className="layout-card" bordered={false}>
        <div
          style={{width: '90%', height: '170px', margin: '0px', paddingBottom: '-20px'}}
          className="work-chart"
          ref={(workChart) => {
            this.workChart = workChart;
          }}></div>
      </Card>
    );
  }
}

export default WorkCharts;
