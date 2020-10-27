import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import asyncComponent from '../asyncComponent';

const IndexComponent =  asyncComponent(() => import('components/view/home/NewIndex'));
const DutyComponent = asyncComponent(()=>import('components/view/monitoring/DutyComponent'));
const Deploy = asyncComponent(()=>import("components/view/monitoring/Deploy"));
const AddTask = asyncComponent(()=>import('components/view/monitoring/Deploy/add/AddTask'));
const AddPatrols = asyncComponent(()=>import('components/view/monitoring/AddPatrols/AddTask'));
const GridRaid  = asyncComponent(()=>import('components/view/monitoring/GridRaid/GridRaid'));
const GridRaidTaskList  = asyncComponent(()=>import('components/view/monitoring/GridRaid/GridRaidTaskList'));
const ViewGridRaidTask = asyncComponent(()=>import('components/view/monitoring/GridRaid/ViewGridRaidTask'));
const ViewGridRaidRealTime = asyncComponent(()=>import('components/view/monitoring/GridRaid/ViewGridRaidRealTime'));
const Pdogdrill = asyncComponent(()=>import('components/view/drill/Pdogdrill'));
const Drillsub = asyncComponent(()=>import('components/view/drill/Drillsub'));
const Officer = asyncComponent(()=>import('components/view/assess/Officer'));
const DogFeed = asyncComponent(()=>import('components/view/dog/DogFeed'));
const DeviceInforList = asyncComponent(()=>import('components/view/deviceManage/DeviceInforList'));
const TestMap =  asyncComponent(()=>import('components/view/test/TestMap'));
const Attend = asyncComponent(()=>import('components/view/attend/Attend'))
const RoundsTrack=asyncComponent(()=>import('components/view/monitoring/RoundsTrack/RoundsTrack'));
const DrillPlan = asyncComponent(()=>import('components/view/drill/DrillPlan'));
const AddPlan = asyncComponent(()=>import('components/view/drill/AddPlan'));
const AddDrillsub = asyncComponent(()=>import('components/view/drill/AddDrillsub'));

const ScheduleManage =  asyncComponent(() => import("components/admin/scheduleManage/ScheduleManage"));
const SmartSchedule = asyncComponent(()=>import("components/admin/scheduleManage/SmartSchedule"));
//排班人员管理
const GroupSchedule = asyncComponent(()=>import("components/admin/scheduleManage/GroupSchedule"));
const AddGropSchedule = asyncComponent(()=>import("components/admin/scheduleManage/AddGropSchedule"));


const PerformanceAppraisal = asyncComponent(()=>import("components/admin/performanceAppraisal/Performance"));
const PerformanceDetailTable = asyncComponent(()=>import('components/admin/tables/performanceAppraisal/PerformanceDetailTable'));
const UserInfo  = asyncComponent(()=>import('components/admin/userInfor/UserInfo'));
const AddUser = asyncComponent(()=>import('components/admin/userInfor/addUserForm'));
// 犬舍监控信息卡片列表
const MonitorDogInfoList = asyncComponent(()=>import('components/admin/monitordog/MonitorDogInfoList/index'));
//犬只管理
const DogInfo = asyncComponent(()=>import('components/admin/dogManage/dogInfor/DogInfo'));
//新增犬只
const AddDog = asyncComponent(()=>import('components/admin/dogManage/dogInfor/AddDogForm'));
const DogInfoView = asyncComponent(()=>import('components/admin/dogManage/dogInfor/DogInfoView'));
//犬病防治数据展示
const DogPrevention=asyncComponent(()=>import('components/admin/dogManage/dogPrevention/DogPrevention'));
//新增犬病防治
const AddPrevention=asyncComponent(()=>import('components/admin/dogManage/dogPrevention/AddPreventionForm'));
const ExecutePlan = asyncComponent(()=>import('components/admin/dogManage/dogPrevention/ExecutePlan'));
//查看/编辑犬病防治
const ViewPrevention=asyncComponent(()=>import('components/admin/tables/DogManage/PreventionDetailTable'));
//犬病治疗数据展示
const DogCure=asyncComponent(()=>import('components/admin/dogManage/dogCure/DogCure'));
//新增犬病治疗
const AddCure=asyncComponent(()=>import('components/admin/dogManage/dogCure/AddCureForm'));
// 视频管理
const Video = asyncComponent(() => import('components/admin/video/Video'));
const VideoInfo = asyncComponent(() => import('components/admin/video/VideoInfo'))
const AddVideo = asyncComponent(() => import('components/admin/video/addVideo'))
// 犬舍管理
const RoomInfo = asyncComponent(() => import('components/admin/dogHouse/Room'));
const RoomEdit = asyncComponent(() => import('components/admin/dogHouse/RoomEdit'));
// 手环管理
const Bracelet = asyncComponent(() => import('components/admin/bracelet/Bracelet'));
const BraceletEdit = asyncComponent(() => import('components/admin/bracelet/BraceletEdit'));
// 场地管理
const TrainPlace = asyncComponent(() => import('components/admin/trainPlace/TrainPlace'));
const TrainPlaceEdit = asyncComponent(() => import('components/admin/trainPlace/TrainPlaceEdit'));
// 4w指挥系统信息录入
const Command = asyncComponent(() => import('components/admin/reportManage/Command/index'));
const CommandEdit = asyncComponent(() => import('components/admin/reportManage/Command/CommandEdit'));
// UWB 
const Uwb = asyncComponent(() => import('components/admin/uwb/Uwb'));
const UwbEdit = asyncComponent(() => import('components/admin/uwb/UwbEdit'));
// 犬只健康
const Doghealth = asyncComponent(()=>import('components/view/dog/DogHealth'));

const Team = asyncComponent(()=>import('components/view/drill/Team'));
const AddTeam = asyncComponent(()=>import('components/view/drill/AddTeam'));
const BreedInfo = asyncComponent(()=>import('components/admin/dogManage/breed/BreedInfo'));
const BreedAdd = asyncComponent(()=>import('components/admin/dogManage/breed/BreedAdd'));
const EditDogChildren = asyncComponent(()=>import('components/admin/dogManage/breed/EditDogChildren'));
const CarList = asyncComponent(()=>import('components/admin/cardInfo/CarInfo'));
const EnterInfoList = asyncComponent(()=>import('components/admin/cardInfo/EnterInfoList'));
const OutList = asyncComponent(()=>import('components/admin/cardInfo/OutList'));
const AddCar = asyncComponent(()=>import('components/admin/cardInfo/AddCar'));
const Goods = asyncComponent(()=>import('components/admin/goods/Goods'));
const AddGoods = asyncComponent(()=>import('components/admin/goods/AddGoods'));
const EsayTask = asyncComponent(()=>import('components/admin/monitordog/EsayTask/index'));
const LeaveCheck = asyncComponent(() => import('components/admin/monitordog/LeaveCheck/index'))
const EsayTaskAdd = asyncComponent(()=>import('components/admin/monitordog/EsayTask/EsayTaskAdd'));
const Assemble = asyncComponent(()=>import('components/admin/monitordog/assemble/index'));
const AssembleAdd = asyncComponent(()=>import('components/admin/monitordog/assemble/AssembleAdd'));

//假期管理
const HolidayList  = asyncComponent(()=>import('components/admin/holiday/HolidayList/index'));
const AddHolidayList  = asyncComponent(()=>import('components/admin/holiday/HolidayList/AddHolidayList'));

const Approval  = asyncComponent(()=>import('components/admin/holiday/Approval/index'));
const ApprovalDetail  = asyncComponent(()=>import('components/admin/holiday/Approval/ApprovalDetail'));

//点名
const Call  = asyncComponent(()=>import('components/admin/holiday/Call/index'));

//上报管理
const ReportApproval  = asyncComponent(()=>import('components/admin/reportManage/Approval/index'));

//上报统计
const ReportStatistics= asyncComponent(()=>import('components/admin/reportManage/Statistics/index'));
//工作信息统计
const WorkLog  = asyncComponent(()=>import('components/admin/reportManage/WorkLog/index'));
//绩效考核
const PerformanceInfo  = asyncComponent(()=>import('components/admin/performance/Info/index'));


const PerformanceRule  = asyncComponent(()=>import('components/admin/performance/Rule/index'));
const PerformanceRegister  = asyncComponent(()=>import('components/admin/performance/Register/index'));
const PerformanceDetail  = asyncComponent(()=>import('components/admin/performance/Register/RegisterDetail'));

const PerformanceEdit  = asyncComponent(()=>import('components/admin/performance/Register/RegisterEdit'));
const routes = [{ path: '/app/home/index',
component: IndexComponent
}, { path: '/app/monitoring/duty',
component: DutyComponent
},{ path: '/app/monitoring/deploy',
component: Deploy
},{
  path: '/app/monitoring/assemble',
  component: Assemble
},{
  path: '/app/monitoring/assembleAdd',
  component: AssembleAdd
},{
  path: '/app/statisticalQuery/leaveCheck',
  component: LeaveCheck
},{
  path: '/app/monitoring/itinerancy',
  component: EsayTask
},
{
  path: '/app/monitoring/itinerancyAdd',
  component: EsayTaskAdd
},
{
  path: '/app/monitoring/itinerancyEdit',
  component: EsayTaskAdd
},
{ path: '/app/monitoring/deployAdd',
component: AddTask
},{ path: '/app/monitoring/dutyAdd', // 新增日常巡逻
component: AddPatrols
},{ path: '/app/monitoring/dutyEdit', // 编辑日常巡逻
component: AddPatrols
},{ path: '/app/monitoring/grid',
component: GridRaidTaskList
},
{ path: '/app/monitoring/addGrid',
component: GridRaid
},{ path: '/app/monitoring/ViewGridRaidTask/:taskID',
component: ViewGridRaidTask
},{ path: '/app/monitoring/ViewGridRaidRealTime/:realID',
component: ViewGridRaidRealTime
},{ path: '/app/drill/pdogdrill',
component: Pdogdrill
},{ path: '/app/drill/drillsub',
component: Drillsub
}, { path: '/app/assess/officer',
component: Officer
},{ path: '/app/dog/feed',
component: DogFeed
},{ path: '/app/config/message',
component: DeviceInforList
}, { path: '/app/test',
component: TestMap
},{ path: '/app/statisticalQuery/attendance',
component: Attend
}, { path: '/app/monitoring/RoundsTrack/:taskID',
component: RoundsTrack
},{
  path: '/app/drill/plan',
  component: DrillPlan,

},{
  path: '/app/drill/planAdd',
  component: AddPlan,

},{
  path: '/app/drill/drillsubAdd',
  component: AddDrillsub,
},{
  path: '/app/drill/drillsubEdit',
  component: AddDrillsub,
},
{
  path: '/app/drill/planEdit',
  component: AddPlan,
},
{
  path: '/app/drill/planDetail',
  component: AddPlan,

},
{
  path: '/app/equipment/materialInfo',
  component: Goods,
}, {
path: '/app/equipment/materialInfoAdd',
component: AddGoods,
},{
  path: '/app/equipment/materialInfoEdit',
  component: AddGoods,
  },{
    path:'/app/equipment/carInfoAdd',
    component: AddCar
  }, {
    path:'/app/equipment/carInfoEdit',
    component: AddCar
  },{ path: '/app/dog/breed',
  component: BreedInfo,
}, {
  path: '/app/dog/reproduce',
  component: BreedInfo,
},{
  path: '/app/dog/reproduceAdd',
  component: BreedAdd,
},
{
  path: '/app/dog/reproduceEdit/:id',
  component: EditDogChildren,
},
{ path: '/app/dog/breedAdd',
  component: BreedAdd,
},
{ path: '/app/dog/breedEdit',
  component: BreedAdd,
}, 
  { path: '/app/drill/team',
  component: Team,
}, 
{ path: '/app/drill/teamAdd',
component: AddTeam,
},
{ path: '/app/drill/teamEdit',
component: AddTeam,
},
  { path: '/app/duty/dutyWeek',
    component: ScheduleManage
  },
  { path: '/app/duty/groupInfo',
    component: GroupSchedule
  },
  { path: '/app/duty/groupInfoAdd',
    component: AddGropSchedule
  },
  { path: '/app/duty/groupInfoEdit',
    component: AddGropSchedule
  },
  { path: '/app/duty/groupInfoDetail',
  component: AddGropSchedule
},
  {
    path: '/app/equipment/bracelet',
    component: Bracelet,
  },
  {
    path: '/app/equipment/uwb',
    component: Uwb,
  },
  {
    path: '/app/equipment/uwbAdd',
    component: UwbEdit,
  },
  {
    path: '/app/equipment/uwbEdit',
    component: UwbEdit,
  },
  {
    path: '/app/equipment/uwbDetail',
    component: UwbEdit,
  },
  {
    path: '/app/equipment/braceletDetail',
    component: BraceletEdit,
  },
  {
    path: '/app/equipment/braceletAdd',
    component: BraceletEdit,
  },
  {
    path: '/app/equipment/braceletEdit',
    component: BraceletEdit,
  },
  {
    path: '/app/basicData/trainPlace',
    component: TrainPlace,
  },
  {
    path: '/app/basicData/trainPlaceDetail',
    component: TrainPlaceEdit,
  },
  {
    path: '/app/basicData/trainPlaceAdd',
    component: TrainPlaceEdit,
  },
  {
    path: '/app/basicData/trainPlaceEdit',
    component: TrainPlaceEdit,
  },
  {
    path: '/app/room/info',
    component: RoomInfo,
  },{
    path: '/app/room/infoEdit',
    component: RoomEdit,
  },{
    path: '/app/room/infoAdd',
    component: RoomEdit,
  },{
    path: '/app/room/infoDetail',
    component: RoomEdit,
  }, {
    path: '/app/equipment/video',
    component: Video,
  },{
    path: '/app/equipment/videoDetail',
    component: AddVideo,
  }, {
    path: '/app/equipment/videoAdd',
    component: AddVideo,
  },{
    path: '/app/equipment/videoEdit',
    component: AddVideo,
  },{
    path: '/app/duty/dutyWeekSchedule',
    component:SmartSchedule
  },{
    path:'/app/assess/performance',
    component:PerformanceAppraisal
  },{
    path:'/app/assess/performanceDetail',
    component:PerformanceDetailTable
  },{
    path:'/app/user/info',
    component:UserInfo
  },{
    path:'/app/user/infoAddUser',
    component:AddUser
  },{
    path:'/app/user/infoUserData',
    component:AddUser
  },{
    path:'/app/user/infoEditUser',
    component:AddUser
  },{
    path:'/app/dog/info',
    component:DogInfo
  },{
    path:'/app/dog/infoAdd',
    component:AddDog
  },{
    path:'/app/dog/infoView',
    component:DogInfoView
  },{
    path:'/app/dog/infoEdit',
    component:AddDog
  },{
    path:'/app/dog/prevention',
    component:DogPrevention
  },{
    path:'/app/dog/preventionAdd',
    component:AddPrevention
  },{
    path:'/app/dog/preventionTodo',
    component:ExecutePlan
  },
  {
    path:'/app/dog/preventionEdit',
    component:AddPrevention
  },{
    path:'/app/dog/preventionView',
    component:ViewPrevention
  },{
    path:'/app/dog/cure',
    component:DogCure
  },{
    path:'/app/dog/cureAdd',
    component:AddCure
  },{
    path:'/app/dog/cureView',
    component:AddCure
  },{
    path:'/app/dog/cureEdit',
    component:AddCure
  },
  {
    path: '/app/dog/health',
    component: Doghealth
  },
  {
    path: '/app/monitor/dogHouse', 
    component: MonitorDogInfoList
  },
  {
    path:'/app/holiday/attendance',
    component:Call
  },
  {
    path:'/app/report/workLog',
    component:WorkLog
  },
  
  {
    path:'/app/holiday/holidayList',
    component:HolidayList
  },
  {
    path:'/app/holiday/holidayListAdd',
    component:AddHolidayList
  },
  {
    path:'/app/holiday/holidayListView',
    component:AddHolidayList
  },
  {
    path:'/app/holiday/holidayListEdit',
    component:AddHolidayList
  },
  {
    path: '/app/car/carList',
    component: CarList
  },
  {
    path: '/app/car/enterInfoList',
    component: EnterInfoList
  },
  {
    path: '/app/car/outList',
    component: OutList
  },
  {
    path: '/app/holiday/approve',
    component: Approval
  },
  {
    path: '/app/holiday/approvalDetail',
    component: ApprovalDetail
  },
  {
    path: '/app/report/approve',
    component: ReportApproval
  },
  
  {
    path: '/app/report/statistics',
    component: ReportStatistics
  },
  {
    path: '/app/performance/rule',
    component: PerformanceRule
  },
  {
    path: '/app/performance/register',
    component: PerformanceRegister
  },
  {
    path: '/app/performance/registerDetail',
    component: PerformanceDetail
  },
  {
    path: '/app/performance/info',
    component: PerformanceInfo
  },
  {
    path: '/app/performance/registerEdit',
    component: PerformanceEdit
  }
  ,
  {
    path: '/app/report/4wcommand',
    component: Command
  }
  ,
  {
    path: '/app/report/4wcommandEdit',
    component: CommandEdit
  }
  ,
  {
    path: '/app/report/4wcommandDetail',
    component: CommandEdit
  }
]

// sub routes are added to any route it'll work
const RouteWithSubRoutes = (route) => (
  <Route exact path={route.path} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes}/>
  )}/>
)
export default class Routes extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <Switch>
       {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
      </Switch>
    )
  }
}


// WEBPACK FOOTER //
// ./src/router/routes/adminRoute.js