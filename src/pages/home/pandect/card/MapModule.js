import React,{Component} from 'react';
import { withRouter,Link } from "react-router-dom";
import { Row, Col, Card,Progress} from 'antd';
import { setMap } from './chartConfig';
const echarts = require('echarts')
import mapJson from '../../cityData/shenshen';
require('style/view/home/mapModule.less');

echarts.registerMap('深圳', mapJson) // 注册主题
class MapModule extends Component{
	constructor(props){
		super(props)
	}
	componentDidMount() {
		this.showChart();
	}
	componentWillReceiveProps(nextProps) {
    var _this = this;
      var compareChart = echarts.getInstanceByDom(this.mapNode);
      if(typeof compareChart !== 'undefined'){
        compareChart.clear();
        _this.showChart();
        return
      }
      _this.showChart();  
  }
	showChart(){
		const { history } = this.props;
	 	setMap(echarts,this.mapNode,history);
	}
	render(){
		return(
			<div className="map-component">
				<Row  type="flex" justify="space-around"className="head-cut">
					<Col span={4} className="active">
						<span className="yellow"></span>
						犬只分布
					</Col>
					<Col span={4}>
						<span className="green"></span>
						出勤巡逻
					</Col>
					<Col span={4}>
						<span className="red"></span>
						网格化搜捕
					</Col>
				</Row>
				<div style={{width:"100%",height:'500px',margin:'0px',boxSizing:'border-box'}} ref={(mapNode)=>{this.mapNode = mapNode}}>
				</div>
				<Row type="flex" justify="space-around" className="area-num">
		      <Col span={4}>
	      		<p>
	      			<span>南山区:</span>10只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
	      		<p>
	      			<span>福田区:</span>12只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
		      </Col>
		      <Col span={4}>
	      		<p>
	      			<span>罗湖区:</span>10只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
	      		<p>
	      			<span>盐田区:</span>12只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
		      </Col>
		      <Col span={4}>
	      		<p>
	      			<span>宝安区:</span>10只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
	      		<p>
	      			<span>龙岗区:</span>12只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
		      </Col>
		      <Col span={4}>
	      		<p>
	      			<span>龙华区:</span>10只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
	      		<p>
	      			<span>光明新区:</span>12只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
		      </Col>
		      <Col span={4}>
	      		<p>
	      			<span>坪山新区:</span>10只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
	      		<p>
	      			<span>大鹏新区:</span>12只
	      		</p>
	      		<Progress percent={30} showInfo={false}  size="small" />
		      </Col>
		    </Row>
			</div>
			
		)
	}
}

export default withRouter(MapModule);




