import React,{ Component } from 'react';
import classnames from 'classnames';
import httpAjax from 'libs/httpAjax';
import { Collapse ,Icon ,Tag , Row, Col, Table, Card,Tabs ,message,Button,Spin,Form,Select,DatePicker} from 'antd';
import moment from 'moment';
import { thirdLayout } from 'components/view/common/Layout';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图。
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';

import 'style/view/common/detailTable.less';
import { clipPointsByRect } from 'echarts/lib/util/graphic';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class PerformanceDetailFrom extends Component {
	constructor(props){
    super(props);
		this.state={
			loading:true,
			title:'统计报表趋势',
			baseDataSource:[],
      pagination: {
        showSizeChanger:true,
        showQuickJumper :true,
        defaultCurrent:1
      },
      xAxisData:["07-01", "07-02", "07-03", "07-04", "07-05"],
      seriesData:[5, 20, 36, 10, 10],
      pageSize:10,
      currPage:1,
      TabList:[],
			performceData:[],
      tabKey:moment(new Date()).format("YYYY-M-DD"),
      typeList:[],
      userNum:0,
      startDate:'',
      endDate:'',
      typeId:1,
      dogNum:0,
			spinLoading:false
		}
	}
	componentWillMount() {
    let reportDate=new Date()
		const params={
      pageSize:this.state.pageSize,
      currPage:1,
      reportDate:moment(reportDate).format("x")
		}	
		//获取基础数据	
		this.fetch(params);
		//获取单个考核项目数据
		const reqUrl=config.apiUrl+'/api/trainCheck/listCheckSearch';
      // 基于准备好的dom，初始化echarts实例
    
  }
  componentDidMount() {
 
    this.searchType();
    this.getTabList();
   
    setTimeout(()=>{
      this.handleSearch();
    },1000) 
}
	componentWillReceiveProps(nextProps) {
		// console.log(nextProps);
  }
  
  showChart(){
     // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    let {xAxisData,seriesData} = this.state;
     myChart.setOption({
        tooltip: {},
        calculable : true,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
        },
        yAxis: {},
        series: [{
            name: '数量',
            data: seriesData,
            lineStyle:{
                color: '#49a9ee',
            },
            type:'line',
            smooth:true,
     //       symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: '#dbeefc'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(219,238,252)'
                    }, {
                        offset: 1,
                        color: 'rgb(73,169,238)'
                    }])
                }
            },
        }]
    });
  }
	fetch(params){
		const reqUrl=config.apiUrl+'/api/taskReport/taskReportCountList';
		let  {baseDataSource}=this.state;
		let obj={};
	    httpAjax('post',reqUrl,params).then((res)=>{
        const data = res.data;
        const pagination = { ...this.state.pagination };
        pagination.total =res.data.pageData.totalCount;
        pagination.current = res.data.pageData.currPage;
        pagination.pageSize = res.data.pageData.pageSize;
	    	if(res.code==0){
		      this.setState({
		      	loading:false,
            baseDataSource:res.data.pageData.list,
            userNum:data.userNum,
            dogNum:data.dogNum,
            pagination:pagination
		      })	    		
        }
	    }).catch(function(error){
	      message.error("error");
	    })
  	}
  	getItemData=(url,options)=>{
  		httpAjax('post',url,options).then((res)=>{
        const pagination = { ...this.state.pagination };
        pagination.total =res.data.pageData.totalCount;
        pagination.current = res.data.pageData.currPage;
        pagination.pageSize = res.data.pageData.pageSize;
  			if(res.code==0){
  				this.setState({baseDataSource:res.data.pageData.list,spinLoading:false, userNum:res.data.userNum,dogNum:res.data.dogNum,pagination:pagination})
  			}
  		})
  	}
  	//tab卡切换
  	itemChange=(value)=>{
  		this.setState({spinLoading:true })
  		this.setState({tabKey:value});
  		const {year,month,userId}=this.state;
  		let  reqUrl="";
  		
			const params={
        pageSize:this.state.pageSize,
        currPage:1,
        reportDate:moment(value).format("x")
      }	
			reqUrl = config.apiUrl+'/api/taskReport/taskReportCountList';
			setTimeout(()=>{
				this.getItemData(reqUrl,params)
			},300)  		
  	}
	getTitle(title){
		return(
			<div>
				<Icon type="bars" />
				&nbsp;&nbsp;&nbsp;
				<Tag color="#2db7f5">{title}</Tag>
			</div>
		)
  }

  handleTableChange=(pagination, filters, sorter)=>{
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      currPage: pagination.current
    });
  }
  searchType = () => {
    httpAjax('post',config.apiUrl+'/api/taskReport/taskReportCommentList',{}).then(res => {
        if(res.code == 0) {
            this.setState({typeList: res.data})
        }
       
    })
}

//获取当月的日期
getTabList=()=>{
  let now = new Date(); 
  let nowDay = now.getDate(); 
  let nowMonth = now.getMonth();
  let nowYear = now.getYear();
  let nowDayOfWeek = now.getDay();
  nowYear += (nowYear < 2000) ? 1900 : 0;
  let TabList=[];
  for(let i=1;i<=nowDay;i++){
    if(i<10){
      TabList.push(nowYear+'-'+(Number(nowMonth)+1)+'-0'+i)
    }else{
      TabList.push(nowYear+'-'+(Number(nowMonth)+1)+'-'+i)
    }
    
  }
  this.setState({
    TabList:TabList,
    tabKey:TabList[TabList.length-1],
    startDate:moment(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)).format("YYYY/MM/DD"),
    endDate:moment(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))).format("YYYY/MM/DD")
  })

}

handleSearch = (e) => {
  if(e){
    e.preventDefault();
  }
  let timeData = 'range-time-picker'; 
  this.props.form.validateFields((err, values) => {
    if(values[timeData]){
      values.leaveStartTime=values[timeData][0].format('x');
      values.leaveEndTime=values[timeData][1].format('x');
    }
    httpAjax('post',config.apiUrl+'/api/taskReport/taskReportCountCommentList',{
        commentId:values.typeId,
        startDate:values.leaveStartTime=="Invalid date"?this.state.startDate:values.leaveStartTime,
        endDate:values.leaveEndTime=="Invalid date"?this.state.endDate:values.leaveEndTime
      }).then(res => {
        if(res.code == 0) {
            let  xAxisData=[],seriesData=[];
            res.data.map((item)=>{
              let time=moment(item.repDate).format("YYYY/M/DD");
              xAxisData.push(time.split('/')[1]+'/'+time.split('/')[2]);
              seriesData.push(item.number);
            })
            this.setState({xAxisData:xAxisData,seriesData:seriesData});
            this.showChart();
        }
      
    })
  });
 
}
getMonthDays=(myMonth)=>{
  let now = new Date(); 
  let nowDay = now.getDate(); 
  let nowMonth = now.getMonth();
  let nowYear = now.getYear();
  let nowDayOfWeek = now.getDay();
  nowYear += (nowYear < 2000) ? 1900 : 0;
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
  return days;
} 

getRangDate=(flag)=>{
  let now = new Date(); 
  let nowDay = now.getDate(); 
  let nowMonth = now.getMonth();
  let nowYear = now.getYear();
  let nowDayOfWeek = now.getDay();
  nowYear += (nowYear < 2000) ? 1900 : 0;
  if(flag=='week'){
    this.setState({
      startDate:moment(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)).format("YYYY/MM/DD"),
      endDate:moment(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))).format("YYYY/MM/DD")
    })
  }else{
    this.setState({
      startDate:moment(new Date(nowYear, nowMonth, 1)).format("YYYY/MM/DD"),
      endDate:moment(new Date(nowYear, nowMonth, this.getMonthDays(nowMonth))).format("YYYY/MM/DD")
    })
  }
  setTimeout(()=>{
    this.handleSearch();
  },300)  	
    
 
}

	render(){
      const {baseDataSource,loading,tabKey,performceData,spinLoading,typeList,TabList,dogNum,userNum,typeId,startDate,endDate}=this.state;
      let start = moment(startDate,"YYYY/MM/DD");
      let end = moment(endDate,"YYYY/MM/DD");
      console.log(start,end);
      const { getFieldDecorator } = this.props.form;
      const typeOption= typeList&&typeList.map((item,index)=>{
        return <Option value={item.id} key={index}>{item.commentName}</Option>
      })
     
    	const baseColumns=[
	    	{
	    		title:'任务名称',
	    		dataIndex:'taskName',
	    		key:'taskName',
	    	},{
	    		title:'区域',
	    		dataIndex:'substation',
	    		key:'substation',
	    	},{
	    		title:'刑事前科',
	    		dataIndex:'xingshiNumber',
	    		key:'xingshiNumber'
	    	},{
	    		title:'涉毒前科',
	    		dataIndex:'sheduNumber',
	    		key:'sheduNumber'
	    	},{
	    		title:'吸毒人员',
	    		dataIndex:'xidurenyuanNumber',
	    		key:'xidurenyuanNumber'
	    	},{
	    		title:'吸毒前科',
	    		dataIndex:'xiduqiankeNumber',
	    		key:'xiduqiankeNumber'
	    	},{
	    		title:'查缉车辆',
	    		dataIndex:'chajiNumber',
	    		key:'chajiNumber'
	    	},{
	    		title:'总计',
	    		dataIndex:'total',
	    		key:'total'
	    	}
    	]
		return(
			<div className={classnames('off-detail')} >
				<div className="detail-table">
			
				  	<Collapse defaultActiveKey={['1','2']}>
					    <Panel showArrow={false} header={this.getTitle('报表形式')} key="1">
              <Form   onSubmit={this.handleSearch} >
                  <Col xl={8} lg={24} md={24} sm={24} xs={24} >
                        <FormItem label='查询类型' {...thirdLayout}>
                          {getFieldDecorator('typeId',{	initialValue:typeId})(
                            <Select placeholder="查询类型"  >
                            {typeOption}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Button type="primary" htmlType="submit">查询</Button>&nbsp;&nbsp;
                     
                      <Col xl={8} lg={12} md={12} sm={24} xs={24} >
                     
                        <FormItem label="时间范围" {...thirdLayout} >
                          {getFieldDecorator('range-time-picker',{initialValue:[start,end]})(
                            <RangePicker  format="YYYY/MM/DD"  />
                          )}
                        </FormItem>
                      </Col>
                      <Button onClick={()=>this.getRangDate('week')}>本周</Button>&nbsp;&nbsp;<Button onClick={()=>this.getRangDate('month')}>本月</Button>
                </Form>
                 <div id="main" style={{ width: '100%', height: '300px' }}></div>			
					    </Panel>
					    <Panel showArrow={false} header={this.getTitle('列表形式')} key="2">
						    <Tabs defaultActiveKey={tabKey} onChange={this.itemChange}>
                  {TabList&&TabList.map((item) =>	<TabPane tab={item} key={item+''}>
                    <div style={{marginBottom:'12px'}}>{tabKey} | 出动警力： <span  style={{ color: '#52c41a' }} >{userNum||0}</span>人 | 携犬出勤：  <span  style={{ color: '#52c41a' }} >{dogNum||0}</span>头 |</div>
                    <Table loading={loading} columns={baseColumns} dataSource={baseDataSource}  pagination={this.state.pagination} onChange={this.handleTableChange} bordered rowKey={'id'+item} />
						    	</TabPane>)}						    							    						    	
						    </Tabs>
					    	{
								spinLoading? 
									<div style={{position: "fixed",top: "60%",left: "50%"}}>
						    		 		<Spin size="large" />
						    		</div>
					    			: ''
					    	}
				    	
					    </Panel>
				  	</Collapse>			  	
				  
				</div>
			</div>
		)
	}
}
const PerformanceDetailTable = Form.create()(PerformanceDetailFrom);
export default PerformanceDetailTable;