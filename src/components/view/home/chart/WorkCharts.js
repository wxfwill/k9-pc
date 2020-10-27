import React,{Component} from 'react';


import { WorkBar } from './chartConfig';
const echarts = require('echarts')

class WorkCharts extends Component{
	constructor(props){
		super(props)
	}
	componentDidMount() {
		this.showChart();
	}
	componentWillReceiveProps(nextProps) {
    var _this = this;
      var compareChart = echarts.getInstanceByDom(this.workChart);
      if(typeof compareChart !== 'undefined'){
        compareChart.clear();
        _this.showChart();
        return
      }
      _this.showChart();  
  	}
	showChart(){
	 	WorkBar(echarts,this.workChart)
	}
	render(){
		return(
			<div style={{width:'90%',height:'170px',margin:'0px',paddingBottom:'-20px'}}  className="work-chart" ref={(workChart)=>{this.workChart = workChart}}>
			</div>
		)
	}
}

export default WorkCharts;




