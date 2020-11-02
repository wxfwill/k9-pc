import React,{Component} from 'react';


import { BarConfig } from './chartConfig';
const echarts = require('echarts')

class BarChart extends Component{
	constructor(props){
		super(props)
	}
	componentDidMount() {
		this.showChart();
	}
	componentWillReceiveProps(nextProps) {
    var _this = this;
      var compareChart = echarts.getInstanceByDom(this.chartNode);
      if(typeof compareChart !== 'undefined'){
        compareChart.clear();
        _this.showChart();
        return
      }
      _this.showChart();  
  }
	showChart(){
	 BarConfig(echarts,this.chartNode)
	}
	render(){
		return(
			<div style={{width:'90%',height:'712px',margin:'0px'}}  className="bar-chart" ref={(chartNode)=>{this.chartNode = chartNode}}>
			</div>
		)
	}
}

export default BarChart;




