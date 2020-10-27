import React,{Component} from 'react';
import classnames from 'classnames';
import { Row, Col ,Card} from 'antd';
import DutyCard from './card/DutyCard';
import LayoutCard from './card/LayoutCard';
import TotalCard from './card/TotalCard';
import WorkCharts from './card/WorkCharts';
import ExeCard from './card/ExeCard';
import TodayCard from './card/TodayCard';
import MapModule from './card/MapModule';
require('style/view/home/pandect.less');
class Pandect extends Component {
	constructor(props){
		super(props);
	}
	render(){
		const { show , handleShow } = this.props;
		return(
			<div className={classnames("Pandect",{show:show,hide:!show})}>
				<div className="panWapper">
					<header onClick={handleShow}></header>
					<section>
					 	<Row gutter={10}>
				      <Col className="gutter-row" xxl={5} xl={5} lg={7} md={7} sm={7} xs={7}>
				        <div className="duty-card">
				        	<DutyCard/>
				        </div>
				        <div className="layout-card">
				        	<LayoutCard/>
				        </div>
				      </Col>
				      <Col className="gutter-row" xxl={14} xl={14} lg={10} md={10} sm={10} xs={10}>
				        <div className="total-card">
				        	<TotalCard/>
				        </div>
				        <div className="dog-map">
				        	<MapModule/>
				        </div>
				      </Col>
				      <Col className="gutter-row" xxl={5} xl={5} lg={7} md={7} sm={7} xs={7}>
				        <div className="duty-status">
			              <WorkCharts/>
				        </div>
				        <div className="duty-status exe-tab">
				          <div className="layout-card"><span className="card-title">训练状态栏</span></div>
			              <ExeCard />
				        </div>
				        <div className="today">
				        	<TodayCard/>
				        </div>
				      </Col>
				    </Row>
					</section>
				</div>
			</div>
		)
	}
}

export default Pandect;



