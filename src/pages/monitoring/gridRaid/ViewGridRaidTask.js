import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as systomState from 'actions/systomStatus';
import { Row, Col, Icon, Spin, Button, Table,Input, Card, Collapse ,Badge,Tag,Tabs,Affix,message ,Popconfirm} from 'antd';
import { tMap } from 'components/view/common/createGridMap'; // map.js改为重写的createGridMap.js
import GridTable from './GridTaskTrackGridTable';
import TaskInfoListView from './GridTaskTaskInfoListView';
import httpAjax from 'libs/httpAjax';
const Panel = Collapse.Panel;
const Search = Input.Search;
const antIcon = <Icon type="loading" style={{ fontSize: 30 }} spin />;
const TabPane = Tabs.TabPane;

require('style/view/monitoring/gridRaid.less');
const jc_path=require("images/jc_64_64.png");
var getRandomColor = function(){
  return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
}

class ViewGridRaidTask extends Component{
  constructor(props){
    super(props);
    this.state= {
      limit:null,
      loading:true,
      cardWidth:560,
      users:[],
      taskStatus:'',
    }  
  }

  componentWillMount() {
    let { unfold } = this.props.systomActions;
    unfold(true);
  }

  componentDidMount() {
    let _this = this;
    this.timmer = setTimeout(function(){
      _this.setState({
        loading:false
      })
    },1000);

    let options = {
      labelText:'我的位置'
    }
  
    let TMap= new tMap(options);
    TMap.drawingManager();//绘图功能
    TMap.setBeatMark();
    TMap.setPolyline();
    _this.TMap=TMap;

     (function(){

        var params={
            taskId: _this.props.match.params.taskID
        }

        httpAjax('post',config.apiUrl+'/api/cmdMonitor/getGridTaskById',{...params}).then((res)=>{
            let users=[];
            // res.data.taskStatus = 2;
            _this.setState({
              taskStatus:res.data.taskStatus
            })
            res.data.details.forEach(function(item,index){
                users.push({
                    bigTaskId:_this.props.match.params.taskID,//主任务id
                    userId:item.userId,
                    number:item.number,
                    userName:item.userName,
                    taskDetailId: item.taskDetailId,
                    areaNo:item.areaNo,
                    id: item.id,
                    dogName:item.dogName,
                    endTime:item.endTime,
                    startTime:item.startTime,
                    status:item.status,
                    color:getRandomColor()
                });    
            });
            TMap.drawingPolygon(res.data.drawShapeDTO.latLngArr,false,res.data.drawShapeDTO.parts||5); //绘制网格信息
        //    _this.refs["child"].setUserList(users); //在右侧展示用户列表信息
            _this.setState({
              users:users
            })
            //创建Marker,标识执勤人员的位置
            let selectPeoples = res.data.details, isHasAddmarker={}, filter_markers=[];
            selectPeoples.forEach(item => {
              let index = item.area.index, number = item.number;
              if(isHasAddmarker[index]){
                filter_markers[index].push(item);
              }else{
                filter_markers[index]=[item];
                isHasAddmarker[index]=true;
              }
            })
            filter_markers.forEach(function(item,index){           
              var path = item[0].area;
              var targetArea = new qq.maps.Polygon({
                editable: false,
                map: TMap.map,
                path: [
                  new qq.maps.LatLng(path.a.lat, path.a.lng), 
                  new qq.maps.LatLng(path.c.lat, path.c.lng),
                  new qq.maps.LatLng(path.d.lat, path.d.lng),
                  new qq.maps.LatLng(path.b.lat, path.b.lng),
                  new qq.maps.LatLng(path.a.lat, path.a.lng)
                ],
                visible: false,
              });
              let labelName = '';
              item.forEach((cItem, index) => {
                let theLabel = index>3 ?'':( index<2?`${cItem.userName} - ${cItem.number} <br>`:(index == 2 ? `${cItem.userName} - ${cItem.number}`:'. . .' ));
                labelName += theLabel;
              })
              var decoration_marker = new qq.maps.MarkerDecoration(item.index + '',new qq.maps.Point(0, -32));
              var marker = new qq.maps.Marker({
                // position:new qq.maps.LatLng(referencePoint.lat, referencePoint.lng),
                position: targetArea.getBounds().getCenter(),
                map: TMap.map,
                decoration: decoration_marker,
                visible:true,
               // title:'警员',
                title: labelName,
                icon:new qq.maps.MarkerImage(jc_path,new qq.maps.Size(64,64))
              });

              var label = new qq.maps.Label({
                content:labelName,
                map: TMap.map,
                offset: new qq.maps.Size(-40, 3),
                position: targetArea.getBounds().getCenter(),
                style: {
                  width: '100%',
                  color: "#fff",
                  fontSize: "10px",
                  background:' transparent',
                  border: 'none',
                  wordWrap: 'break-word'
                },
                visible: true,
                zIndex: 1000,
              });
            })
            // res.data.details.forEach(function(item,index){           
            //   var referencePoint = item.referencePoint;
            //   var path = item.area;
            //   var targetArea = new qq.maps.Polygon({
            //     editable: false,
            //     map: TMap.map,
            //     path: [
            //       new qq.maps.LatLng(path.a.lat, path.a.lng), 
            //       new qq.maps.LatLng(path.c.lat, path.c.lng),
            //       new qq.maps.LatLng(path.d.lat, path.d.lng),
            //       new qq.maps.LatLng(path.b.lat, path.b.lng),
            //       new qq.maps.LatLng(path.a.lat, path.a.lng)
            //     ],
            //     visible: false,
            //   });
            //   var decoration_marker = new qq.maps.MarkerDecoration(item.index + '',new qq.maps.Point(0, -24));
            //   var marker = new qq.maps.Marker({
            //     // position:new qq.maps.LatLng(referencePoint.lat, referencePoint.lng),
            //     position: targetArea.getBounds().getCenter(),
            //     map: TMap.map,
            //     decoration: decoration_marker,
            //     visible:true,
            //    // title:'警员',
            //     title:item.userName+"-"+item.number,
            //     icon:new qq.maps.MarkerImage(jc_path,new qq.maps.Size(48,48))
            //   });
            // });

        }).catch(function(error){
            console.log(error);
        })
    
    })();

  }

  componentWillUnmount() {
    clearTimeout(this.timmer);
  }

  handleLimit= (limit)=>{
    this.setState({limit:limit});
  }

  drawTrace=(gpsData,pageNo,strokeColor)=>{ //绘制轨迹
    var path=[];
    if(gpsData.length>0){
      gpsData.forEach((item,index)=>{
         path.push(new qq.maps.LatLng(item.lat,item.lng))
      });

      new qq.maps.Polyline({
        map: this.TMap.map,
        path: path,
        strokeColor:strokeColor,
        strokeWeight: 4,
      });
      this.TMap.map.setCenter(new qq.maps.LatLng(path[0].lat, path[0].lng))//根据指定的范围调整地图视野
      if(typeof pageNo!=undefined && pageNo==1){  //当是第一页的时候,将地图移动绘制轨迹的第一个点
        this.TMap.map.panTo(new qq.maps.LatLng(path[0].lat, path[0].lng));
      }
   }

  }
  handleShow(){
    let {cardWidth} = this.state;
    this.setState({
       cardWidth:cardWidth==0?560:0
    })
  }
  /**开始/结束任务**/
  beginOrStopTask=(type)=>{
    let method = '/api/cmdMonitor/beginGridSearch';
    let msg = '任务已开始！';
    if(type==1){
      method = '/api/cmdMonitor/stopGridSearch';
      msg = '任务已结束！';
    }
    let status = type==0 ?1:2;
    httpAjax('post',config.apiUrl+method,{id: this.props.match.params.taskID}).then((res)=>{
      this.setState({
        taskStatus: status
      })
      message.success(msg);
    }).catch(function(error){
        console.log(error);
    })
  }
  //地点搜索
  onSearch =(value)=>{
  this.TMap.searchService().search(value);
  }
  render() {
    const { collapsed } = this.props.systomState;
    const {cardWidth,taskStatus,users} = this.state;
    const topStr=<div style={{marginTop:2}}>{'网格化搜捕'}
                      {taskStatus<2?
                        taskStatus==0?
                         <Tag color="#108ee9" onClick={() => this.beginOrStopTask(0)} style={{float:'right'}} >开始任务</Tag>:
                        <Popconfirm title='确认终止此任务信息?' onConfirm={() => this.beginOrStopTask(1)}>
                          <Tag color="#f50" style={{float:'right'}} >结束任务</Tag>
                        </Popconfirm>
                      :null}
                  </div>
    return (
      <div className="GridRaid" style={{left:collapsed?"92px":"212px"}}>
        <Spin indicator={antIcon} size="large" tip="数据加载中..." spinning={ this.state.loading } style={{position:'absolute',top:'50%',left:'50%',zIndex:'9999'}}/>
        <Row gutter={24} id="container">
            <Card title={topStr} extra={<Tag color="#2db7f5" onClick={this.props.history.goBack}><Icon type="rollback" />返回</Tag>}   bordered={false}  bordered style={{ width: cardWidth,position:'absolute',top:'0',right:'0',zIndex:'9999'}}>
                <span className="p-icon" style={{right: cardWidth}} onClick={this.handleShow.bind(this)}>
                    <Icon type={cardWidth==0?'left':'right'} />
                </span>      
                <Search
                    placeholder="地点搜索"
                    onSearch={value => this.onSearch(value)}
                    enterButton
                  />
                <Tabs defaultActiveKey="1" onTabClick={this.onchildTabClick}>
                    <TabPane tab="查询轨迹" key="1">
                        <GridTable ref="child" drawTrace={this.drawTrace} users={users} taskStatus={taskStatus} taskID={this.props.match.params.taskID}/>             
                    </TabPane>
                    <TabPane tab="查看任务详情" key="2" >
                        <TaskInfoListView  taskID={this.props.match.params.taskID}/>
                    </TabPane>
                 </Tabs>  
            </Card>
            {cardWidth==0?<Affix style={{ position: 'absolute', top:18, right: 10}}>
                                    <Button
                                    type="primary"
                                    onClick={
                                      this.props.history.goBack
                                    }
                                  >
                                    <Icon type="rollback" />返回
                                  </Button>
                                </Affix>:null} 
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  systomState:state.system,
})

const mapDispatchToProps = dispatch => ({
  systomActions: bindActionCreators(systomState,dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewGridRaidTask)


// WEBPACK FOOTER //
// ./src/components/view/monitoring/GridRaid/ViewGridRaidTask.js