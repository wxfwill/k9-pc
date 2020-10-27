import React,{ Component } from 'react';
import classnames from 'classnames';
import httpAjax from 'libs/httpAjax';
import { Collapse ,Icon ,Tag , Row, Col, Table, Card} from 'antd';
import moment from 'moment';
import 'style/view/common/detailTable.less'
const Panel = Collapse.Panel;

class CureDetailTabl extends Component {
	constructor(props){
		super(props);
		this.state={
			loading:true,
			baseData:'',
			medicalrecords:[],
			title:'病历记录',
		}
	}
	componentWillMount() {
		const { caption } = this.props;
		this.fetch(caption);
	}
	componentWillReceiveProps(nextProps) {
		// console.log(nextProps);
	}
	handleShow(){
		this.props.handleShow();
	}
	fetch(params){

    httpAjax('post',config.apiUrl+'/api/treatmentRecord/info',{id:params.id}).then((res)=>{
      this.setState({
      	loading:false,
        baseData:res.data&&res.data.dogInfo,
        medicalrecords:res.data&&res.data.treatmentRecordInfo
      })
    }).catch(function(error){
      console.log(error);
    })
  }
	renderhead(caption){
		if(caption.length>0){
			let MonthYear = caption.split('_')[1];
			return(
				<div>
					<Icon type="calendar" />
					&nbsp;&nbsp;&nbsp;
					<Tag color="#2db7f5">{MonthYear}</Tag>
				</div>
			)
		}
	}
	checkHeader(){
    const {title}=this.state;
		return(
			<div>
				<Icon type="bars" />
				&nbsp;&nbsp;&nbsp;
				<Tag color="#2db7f5">{title}</Tag>
			</div>
		)
	}
	baseHeader(){
		return(
			<div>
				<Icon type="bars" />
				&nbsp;&nbsp;&nbsp;
				<Tag color="#2db7f5">基础信息</Tag>
			</div>
		)
	}


	render(){
		const { changeLeft , caption } = this.props;
    const {baseData,medicalrecords,loading}=this.state;
        let date = new Date(baseData.birthday);
        let YMD = date.toLocaleString().split(' ')[0];
        //let HMS = date.toString().split(' ')[4];
        let morbidityTime = YMD//+' '+HMS;
    const recordsColumns=[
      {
        title:'发病日期',
        dataIndex:'morbidityTime',
        render:time=>{
          let date = new Date(time);
          let YMD = date.toLocaleString().split(' ')[0];
          let HMS = date.toString().split(' ')[4];
          let morbidityTime = YMD+' '+HMS;
          return morbidityTime
        }
      },{
        title:'主要症状',
        dataIndex:'symptom',
      },{
        title:'治疗结果',
        dataIndex:'treatmentResults',
        render:result=>{
          let resArr = [<Tag color="#2db7f5">痊&nbsp;&nbsp;&nbsp;愈</Tag>,<Tag color="#f50">未痊愈</Tag>];
          return resArr[result-1]
      }
      },{
        title:'兽医',
        dataIndex:'veterinaryName'
      }
    ]
		return(
			<div className={classnames('off-detail')} style={{left:changeLeft?'360px':'100%'}}>
				<div className="detail-table">
				  <Card title={this.state.title}>
            		{/*<span>创建时间:20180201</span>*/}
				  	<Collapse defaultActiveKey={['1','2']}>
					    <Panel showArrow={false} header={this.baseHeader()} key="1">
					      <Row gutter={24}>
	          			<Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24} >
                      <div className='baseDataTable'>
                        <Row >
                            <Col  span={6}>档案编号</Col>
                            <Col  span={6}>{baseData.number}</Col>
                            <Col  span={6}>犬只名称</Col>
                            <Col  span={6}>{baseData.name}</Col>                    
                        </Row>
                        <Row >
                            <Col  span={6}>犬只性别</Col>
                            <Col  span={6}>{baseData.sex}</Col>
                            <Col  span={6}>出生日期</Col>
                            <Col  span={6}>{morbidityTime}</Col>                    
                        </Row>
                        <Row >
                            <Col  span={6}>犬只品种</Col>
                            <Col  span={6}>{baseData.breed}</Col>
                            <Col  span={6}>芯片号</Col>
                            <Col  span={6}>{baseData.chipCode}</Col>                    
                        </Row>
                        {/*<Row >
                            <Col  span={6}>犬只毛色</Col>
                            <Col  span={6}>档案编号</Col>
                            <Col  span={6}>犬只毛型</Col>
                            <Col  span={6}>档案编号</Col>                     
                        </Row>*/}                                                                                                
                      </div>
	          			</Col>
	          		</Row>
					    </Panel>
					    <Panel showArrow={false} header={this.checkHeader()} key="2">
					      <Row gutter={24}>
	          			<Col xxl={16} xl={24} lg={24} md={24} sm={24} xs={24} >
                    		<Table loading={loading} columns={recordsColumns} dataSource={medicalrecords}  pagination={false} bordered rowKey='id' />
	          			</Col>
	          		</Row>
					    </Panel>
				  	</Collapse>
				  </Card>
				</div>
				<span className="cursor p-icon" onClick={this.handleShow.bind(this)}>
						<Icon type="right" />
				</span>
			</div>
		)
	}
}


export default CureDetailTabl;