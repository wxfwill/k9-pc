import React,{Component} from 'react';
import { Row, Col, Card, Tooltip, Icon, Radio ,Badge} from 'antd';
import WorkCharts from './chart/WorkCharts';
import ExeCard from './card/ExeCard';
import TodayCard from './card/TodayCard';
import DutyCard from './card/DutyCard';
import httpAjax from 'libs/httpAjax';
class FooterCard extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<Row gutter={24}>
          <Col xl={5} lg={24} md={24} sm={24} xs={24}>
            <DutyCard/>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card title="出勤状态栏" hoverable>
            	<WorkCharts/>
            </Card>
          </Col>
          <Col xl={5} lg={24} md={24} sm={24} xs={24}>
            <Card title="训练状态栏" className='exe-status' hoverable>
            	<ExeCard/>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card title="今日动态" hoverable extra={<Badge count={'news'} />}>
              <TodayCard/>
            </Card>
          </Col>
      </Row>
		)
	}
}

export default FooterCard;



