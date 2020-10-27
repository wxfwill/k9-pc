import React from 'react';
import { List, Card, Icon, Avatar ,Table ,Tag ,Button ,Spin} from 'antd';
import httpAjax from 'libs/httpAjax';
import Immutable from 'immutable';
require('style/app/scheduleManage/smartList.less');
let initState = {
  loading: true,
  loadingMore: false,
  showLoadingMore: true,
  data: [],
  currPage:1,
  noMoreData:true
}
class SmartTable extends React.Component{
	constructor(props){
		super(props);
		this.state = initState;
	}
  componentDidMount() {
    this.fetch({startDate:this.props.filter.startTime,endDate:this.props.filter.endTime,currPage:this.state.currPage},true)
  }
  componentWillReceiveProps(nextProps) {
    if(Immutable.is(Immutable.Map(this.props.filter), Immutable.Map(nextProps.filter))) {
      return
    }
    let { filter } = nextProps;
    let _this = this;
    if(!(this.props.filter.startTime==filter.startTime&&this.props.filter.endTime==filter.endTime)){
      this.setState(initState,function(){
        _this.fetch({startDate:filter.startTime,endDate:filter.endTime,currPage:1},true);
      })
    };
  }
  fetch(params,isFirst){
    let _this = this;
    let reqUrl = isFirst?config.apiUrl+'/api/onDuty/genDutyData':config.apiUrl+'/api/onDuty/getDutyDataByPage';
    this.setState({ loading: true });
    httpAjax('post',reqUrl,{...params}).then((res)=>{
      if(res.code==0){
        _this.handleData(res.data);
      }
    }).catch(function(error){
      console.log(error);
    })
  }
  handleData(data,callback){
    let _this = this;
    let dateArr = [];
    let mondayArr = [];
    let tuesdayArr = [];
    let wednesdayArr = [];
    let thursdayArr = [];
    let fridayArr = [];
    let saturdayArr = [];
    let sundayArr = [];
    let resData = data.list[0];
    let dateMsg = resData.dutyDates.splice(0,1);
    let titleArr = ['带班领导','值班','副班','值班辅警','消毒人员','备注'];
    resData.dutyDates.forEach((items,index)=>{
      Array.prototype.push.call(mondayArr,{name:items.monday});
      Array.prototype.push.call(tuesdayArr,{name:items.tuesday});
      Array.prototype.push.call(wednesdayArr,{name:items.wednesday});
      Array.prototype.push.call(thursdayArr,{name:items.thursday});
      Array.prototype.push.call(fridayArr,{name:items.friday});
      Array.prototype.push.call(saturdayArr,{name:items.saturday});
      Array.prototype.push.call(sundayArr,{name:items.sunday});
    });
    let dutyData = [mondayArr,tuesdayArr,wednesdayArr,thursdayArr,fridayArr,saturdayArr,sundayArr];
    dutyData.forEach((items,indexs)=>{
      _this.pushData(items,resData);
      items.forEach((item,index)=>{
        item.key = Math.random();
        item.title = titleArr[index]; 
      })
    })
    Object.keys(dateMsg[0]).forEach((items,index)=>{
      Array.prototype.push.call(dateArr,{title:dateMsg[0][items],tableData:dutyData[index]})
    });
    console.log(data);
    this.setState({
        loadingMore:false,
        loading: false,
        noMoreData:this.state.currPage == data.totalPage,
        data:Array.prototype.concat.call(this.state.data,dateArr),
    });
  }
  pushData(array,resData){
    Array.prototype.push.call(array,{
      name:{sterilizeLeader:{
        userId:resData.sterilizeLeader.id,
        userName:resData.sterilizeLeader.name,
        groupId:resData.sterilizeLeader.groupId
      },
      sterilizeEmployee:{
        userId:resData.sterilizeEmployee.id,
        userName:resData.sterilizeEmployee.name, 
        groupId:resData.sterilizeEmployee.groupId,         
      },        
      sterilizeAuxiliary:{
        userId:resData.sterilizeAuxiliary.id,
        userName:resData.sterilizeAuxiliary.name,
        groupId:resData.sterilizeAuxiliary.groupId,
      }}
    },{name:{userName:resData.remark}});
  }
  onLoadMore = () => {
    if(this.state.noMoreData){
      util.Msg.warning('没有更多数据...')
      return;
    } 
    let _this = this;
    this.setState({
      loadingMore: true,
      loading:false,
      currPage:this.state.currPage+1,
    },function(){
      let { filter } = _this.props;
      _this.fetch({startDate:filter.startTime,endDate:filter.endTime,currPage:this.state.currPage});
      window.dispatchEvent(new Event('resize'));
    });
  }
	getCardColumns(){
		const columns = [{
			className:'smart-item',
		  dataIndex: 'title',
		  key:"title",
      render:(text, record, index)=>{
        return text;
      }
		}, {
		  dataIndex: 'name',
		  key: 'name',
		  render:(text, record, index)=>{
        let showMsg = '';
        if(typeof text.sterilizeLeader!=="undefined"){
          let { sterilizeLeader, sterilizeEmployee, sterilizeAuxiliary } = text;
          showMsg = sterilizeLeader.userName+'，'+sterilizeEmployee.userName+'，'+sterilizeAuxiliary.userName;
        }
        return typeof text.userName!=='undefined'?text.userName:showMsg;
      }
		}]
		return columns;
	}
	render(){
		const { loading, loadingMore, showLoadingMore } = this.state;
		  const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button onClick={this.onLoadMore}>{this.state.noMoreData?'没有更多数据':'加载更多...'}</Button>}
      </div>
    ) : null;
		return(
			<div className="smart-list">
				<List
					split={false}
					loading={loading}
					loadMore={loadMore}
			    grid={{ gutter: 16, xs: 1, sm: 1, md:2, lg: 2, xl: 3, xxl:4 }}
			    dataSource={this.state.data}
			    renderItem={item => (
			      <List.Item>
			        <Card
			        	title={'排班信息'}
			        	extra={<Tag color="#99a9bf">{item.title.userName}</Tag>}
			        	hoverable
    						actions={[<Icon type="delete" style={{fontSize:'20px'}}/>, <Icon type="edit" />]}
  						>
  							<Table
							    columns={this.getCardColumns()}
							    dataSource={item.tableData}
							    bordered
							    pagination={false}
							    showHeader={false}
							  />
  						</Card>
			      </List.Item>
			    )}
			  />
			</div>
		)
	}
}
export default SmartTable;


// WEBPACK FOOTER //
// ./src/components/admin/tables/ScheduleManage/SmartSchedule/SmartList.js