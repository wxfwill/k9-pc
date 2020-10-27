import React,{Component} from 'react';
import { Row, Col, Card, Tooltip, Button} from 'antd';
import httpAjax from 'libs/httpAjax';

require('style/view/home/totalCard.less');
class TotalCard extends Component {
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div className="total-card">
				<Row type="flex" justify='space-between' className='num-total'>
	        <Col md={{span:5}} sm={12} xs={24} >
	          <Card
	            className="card-num sum"
	            hoverable
	            bordered={false}
	            title={<p><span style={{fontSize:'35px'}}>297</span>头</p>}
	          >
	            <div>警犬库</div>
	          </Card>
	        </Col>
	        <Col md={{span:5,offset:1}} sm={12} xs={24} >
	          <Card
	            className="card-num go"
	            hoverable
	            bordered={false}
	            title={<p><span style={{fontSize:'35px'}}>126</span>头</p>}
	          >
	            <div>出勤犬只</div>
	          </Card>
	        </Col>
	        <Col md={{span:5,offset:1}} sm={12} xs={24}>
	          <Card
	            className="card-num serve"
	            hoverable
	            bordered={false}
	            title={<p><span style={{fontSize:'35px'}}>26</span>头</p>}
	          >
	            <div>服役犬只</div>
	          </Card>
	        </Col>
	        <Col md={{span:5,offset:1}} sm={12} xs={24}>
	          <Card
	            className="card-num haven"
	            hoverable
	            bordered={false}
	            title={<p><span style={{fontSize:'35px'}}>26</span>头</p>}
	          >
	            <div>在监数（犬舍）</div>
	          </Card>
	        </Col>
	      </Row>
			</div>
		)
	}
}

export default TotalCard;












