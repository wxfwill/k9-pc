import asyncComponent from './asyncComponent';

// import LoginComponent from 'pages/login/Login';
const LoginComponent = asyncComponent(() => import(/*webpackChunkName: 'LoginComponent'*/ 'pages/login/Login'));

//main
// import Main from 'pages/main/Main';
const Main = asyncComponent(() => import(/*webpackChunkName: 'IndexComponent'*/ 'pages/main/Main'));

// 首页
// import IndexComponent from 'pages/home/NewIndex';
const IndexComponent = asyncComponent(() => import(/*webpackChunkName: 'IndexComponent'*/ 'pages/home/NewIndex'));

// 承载路由
// import BearerRoute from 'pages/BearerRoute';
const BearerRoute = asyncComponent(() => import(/*webpackChunkName: 'IndexComponent'*/ 'pages/BearerRoute'));

// 网格化搜捕
const DutyComponent = asyncComponent(() => import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/DutyComponent'));
const Deploy = asyncComponent(() => import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/Deploy'));
const AddTask = asyncComponent(() => import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/Deploy/add/AddTask'));
const AddPatrols = asyncComponent(() =>
  import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/AddPatrols/AddTask')
);
const GridRaid = asyncComponent(() => import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/GridRaid/GridRaid'));
const GridRaidTaskList = asyncComponent(() =>
  import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/GridRaid/GridRaidTaskList')
);

const ViewGridRaidTask = asyncComponent(() =>
  import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/GridRaid/ViewGridRaidTask')
);
const ViewGridRaidRealTime = asyncComponent(() =>
  import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/GridRaid/ViewGridRaidRealTime')
);
const RoundsTrack = asyncComponent(() =>
  import(/*webpackChunkName: 'monitoring'*/ 'pages/monitoring/RoundsTrack/RoundsTrack')
);

// 科学训练
const Pdogdrill = asyncComponent(() => import(/*webpackChunkName: 'drill'*/ 'pages/drill/Pdogdrill'));
const Drillsub = asyncComponent(() => import(/*webpackChunkName: 'drill'*/ 'pages/drill/Drillsub'));
const DrillPlan = asyncComponent(() => import(/*webpackChunkName: 'drill'*/ 'pages/drill/DrillPlan'));
const AddPlan = asyncComponent(() => import(/*webpackChunkName: 'drill'*/ 'pages/drill/AddPlan'));
const AddDrillsub = asyncComponent(() => import(/*webpackChunkName: 'drill'*/ 'pages/drill/AddDrillsub'));
const Team = asyncComponent(() => import(/*webpackChunkName: 'drill'*/ 'pages/drill/Team'));
const AddTeam = asyncComponent(() => import(/*webpackChunkName: 'drill'*/ 'pages/drill/AddTeam'));

// 日常养护
//犬只管理
const DogInfo = asyncComponent(() => import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/dogInfor/DogInfo'));
//新增犬只
const AddDog = asyncComponent(() => import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/dogInfor/AddDogForm'));
const DogInfoView = asyncComponent(() =>
  import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/dogInfor/DogInfoView')
);
//犬病防治数据展示
const DogPrevention = asyncComponent(() =>
  import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/dogPrevention/DogPrevention')
);
//新增犬病防治
const AddPrevention = asyncComponent(() =>
  import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/dogPrevention/AddPreventionForm')
);
const ExecutePlan = asyncComponent(() =>
  import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/dogPrevention/ExecutePlan')
);
//犬病治疗数据展示
const DogCure = asyncComponent(() => import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/dogCure/DogCure'));
//新增犬病治疗
const AddCure = asyncComponent(() => import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/dogCure/AddCureForm'));
const BreedInfo = asyncComponent(() => import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/breed/BreedInfo'));
const BreedAdd = asyncComponent(() => import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/breed/BreedAdd'));
const EditDogChildren = asyncComponent(() =>
  import(/*webpackChunkName: 'dogManage'*/ 'pages/dogManage/breed/EditDogChildren')
);

//绩效考核
const PerformanceInfo = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/Info/index')
);
const PerformanceRule = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/Rule/index')
);
const PerformanceRegister = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/Register/index')
);

const PerformanceDetail = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/Register/RegisterDetail')
);
const PerformanceEdit = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/Register/RegisterEdit')
);
const PerformanceAssessmentSetting = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/AssessmentSetting/index')
);
const PerformanceAssessmentList = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/AssessmentList/index')
);
const PerformanceAssessmentDetail = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/AssessmentList/detail')
);
const PerformanceTitleSetting = asyncComponent(() =>
  import(/*webpackChunkName: 'performance'*/ 'pages/performance/TitleSetting/index')
);

// 智能排版
const ScheduleManage = asyncComponent(() =>
  import(/*webpackChunkName: 'scheduleManage'*/ 'pages/scheduleManage/ScheduleManage')
);
const SmartSchedule = asyncComponent(() =>
  import(/*webpackChunkName: 'scheduleManage'*/ 'pages/scheduleManage/SmartSchedule')
);
//排班人员管理
const GroupSchedule = asyncComponent(() =>
  import(/*webpackChunkName: 'scheduleManage'*/ 'pages/scheduleManage/GroupSchedule')
);
const AddGropSchedule = asyncComponent(() =>
  import(/*webpackChunkName: 'scheduleManage'*/ 'pages/scheduleManage/AddGropSchedule')
);

//考勤管理
const HolidayList = asyncComponent(() => import(/*webpackChunkName: 'holiday'*/ 'pages/holiday/HolidayList/index'));
const AddHolidayList = asyncComponent(() =>
  import(/*webpackChunkName: 'holiday'*/ 'pages/holiday/HolidayList/AddHolidayList')
);
const Approval = asyncComponent(() => import(/*webpackChunkName: 'holiday'*/ 'pages/holiday/Approval/index'));
const ApprovalDetail = asyncComponent(() =>
  import(/*webpackChunkName: 'holiday'*/ 'pages/holiday/Approval/ApprovalDetail')
);
//点名
const Call = asyncComponent(() => import(/*webpackChunkName: 'holiday'*/ 'pages/holiday/Call/index'));

//基础数据 犬舍管理
const RoomInfo = asyncComponent(() => import(/*webpackChunkName: 'baseData'*/ 'pages/baseData/dogHouse/Room'));
const RoomEdit = asyncComponent(() => import(/*webpackChunkName: 'baseData'*/ 'pages/baseData/dogHouse/RoomEdit'));
//基础数据 智能颈环
const Bracelet = asyncComponent(() => import(/*webpackChunkName: 'baseData'*/ 'pages/baseData/bracelet/Bracelet'));
const BraceletEdit = asyncComponent(() =>
  import(/*webpackChunkName: 'baseData'*/ 'pages/baseData/bracelet/BraceletEdit')
);

//新版--考勤管理

//考勤信息查询
const AttendanceInfor = asyncComponent(() =>
  import(/*webpackChunkName: 'holiday'*/ 'pages/holiday/AttendanceInfor/index')
);

//新版本--用户管理

// 用户列表
const UserInfo = asyncComponent(() => import(/*webpackChunkName: 'user'*/ 'pages/userManage/user/UserInfo'));
const AddUser = asyncComponent(() => import(/*webpackChunkName: 'user'*/ 'pages/userManage/user/addUserForm'));
// 角色列表
const RoleInfo = asyncComponent(() => import(/*webpackChunkName: 'user'*/ 'pages/userManage/role/List'));
// 菜单维护
const MenuInfo = asyncComponent(() => import(/*webpackChunkName: 'user'*/ 'pages/userManage/menu/index'));
// 机构列表
const OrganList = asyncComponent(() => import(/*webpackChunkName: 'user'*/ 'pages/userManage/organ/index'));
// 系统树
const SysTreeList = asyncComponent(() => import(/*webpackChunkName: 'user'*/ 'pages/userManage/k9sysTree/index'));

// 新版--上报统计
// 上报
const FourReport = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/FourReport/index')
);
// 工作用车信息查询
const FourReportListSearch = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/FourReportListSearch/index')
);
// 出勤用车
const AttendanceCar = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/AttendanceCar/index')
);
// 其他事物上报
const OtherThingsReport = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/OtherThingsReport/index')
);
// 中队统计
const TeamWorkStatist = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/TeamWorkStatist')
);
const TeamWorkStatistDetal = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/TeamWorkStatist/DetalList')
);
// 个人统计
const OwnWorkStatise = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/OwnWorkStatise')
);
const OwnWorkStatiseDetal = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/OwnWorkStatise/TaskDetalList')
);

//导入4W报备
const ImportFile = asyncComponent(() => import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/ImportFile'));
//日报信息查询
const DailyInformation = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/DailyInformation')
);
//请假/离深/补休信息查询
const LeaveInformation = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/LeaveInformation')
);
//加班/夜班信息查询
const OvertimeInformation = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/OvertimeInformation')
);
//奖励信息查询
const AwardInformation = asyncComponent(() =>
  import(/*webpackChunkName: 'reportManage'*/ 'pages/reportManage/AwardInformation')
);

const Officer = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/view/assess/Officer'));
const DogFeed = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/view/dog/DogFeed'));
const DeviceInforList = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/view/deviceManage/DeviceInforList')
);
const TestMap = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/view/test/TestMap'));
const Attend = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/view/attend/Attend'));

const PerformanceAppraisal = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/performanceAppraisal/Performance')
);
const PerformanceDetailTable = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/tables/performanceAppraisal/PerformanceDetailTable')
);

// 犬舍监控信息卡片列表
const MonitorDogInfoList = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/monitordog/MonitorDogInfoList/index')
);

//查看/编辑犬病防治
const ViewPrevention = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/tables/DogManage/PreventionDetailTable')
);

// 视频管理
const Video = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/video/Video'));
const VideoInfo = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/video/VideoInfo'));
const AddVideo = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/video/addVideo'));

// 场地管理
const TrainPlace = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/trainPlace/TrainPlace')
);
const TrainPlaceEdit = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/trainPlace/TrainPlaceEdit')
);

// UWB
const Uwb = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/uwb/Uwb'));
const UwbEdit = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/uwb/UwbEdit'));
// 犬只健康
const Doghealth = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/view/dog/DogHealth'));
const CarList = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/cardInfo/CarInfo'));
const EnterInfoList = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/cardInfo/EnterInfoList')
);
const OutList = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/cardInfo/OutList'));
const AddCar = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/cardInfo/AddCar'));
const Goods = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/goods/Goods'));
const AddGoods = asyncComponent(() => import(/*webpackChunkName: 'components'*/ 'components/admin/goods/AddGoods'));
const EsayTask = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/monitordog/EsayTask/index')
);
const LeaveCheck = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/monitordog/LeaveCheck/index')
);
const EsayTaskAdd = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/monitordog/EsayTask/EsayTaskAdd')
);
const Assemble = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/monitordog/assemble/index')
);
const AssembleAdd = asyncComponent(() =>
  import(/*webpackChunkName: 'components'*/ 'components/admin/monitordog/assemble/AssembleAdd')
);

// 档案管理
const Archivew = asyncComponent(() => import(/*webpackChunkName: 'archives'*/ 'pages/archives/index'));
const ArchivewList = asyncComponent(() => import(/*webpackChunkName: 'archives'*/ 'pages/archives/List'));

const routerArr = [
  {
    path: '/',
    exact: true,
    component: LoginComponent,
  },
  {
    path: '/login',
    component: LoginComponent,
    requiresAuth: false,
  },
  {
    path: '/archivew',
    component: Archivew,
    requiresAuth: false,
  },
  {
    path: '/app',
    component: Main,
    requiresAuth: false,
    items: [
      // {
      //   path: '/',
      //   exact: true,
      //   render: () => <Redirect to={'/app/home/index'} />,
      // },
      { path: '/app/index', component: IndexComponent, name: '首页' },
      {
        path: '/app/monitoring',
        component: BearerRoute,
        name: '指挥作战',
        items: [
          { path: '/app/monitoring/duty', component: DutyComponent, name: '日常巡逻' },
          { path: '/app/monitoring/deploy', component: Deploy, name: '紧急调配' },
          {
            path: '/app/monitoring/assemble',
            component: Assemble,
            name: '定点集合',
          },
          {
            path: '/app/monitoring/assembleAdd',
            component: AssembleAdd,
            name: '新增定点集合',
          },
          {
            path: '/app/monitoring/itinerancy',
            component: EsayTask,
            name: '外勤任务',
          },
          {
            path: '/app/monitoring/itinerancyAdd',
            component: EsayTaskAdd,
            name: '创建任务',
          },
          {
            path: '/app/monitoring/itinerancyEdit',
            component: EsayTaskAdd,
            name: 'assemble',
          },
          { path: '/app/monitoring/deployAdd', component: AddTask, name: 'assemble' },
          {
            path: '/app/monitoring/dutyAdd', // 新增日常巡逻
            component: AddPatrols,
            name: '日常巡逻',
          },
          {
            path: '/app/monitoring/dutyEdit', // 编辑日常巡逻
            component: AddPatrols,
            name: '编辑',
          },
          {
            path: '/app/monitoring/grid',
            component: BearerRoute,
            name: '网格化任务',
            items: [
              { path: '/app/monitoring/grid/list', component: GridRaidTaskList, name: '列表' },
              { path: '/app/monitoring/grid/addGrid', component: GridRaid, name: '新建' },
            ],
          },
          { path: '/app/monitoring/ViewGridRaidTask/:taskID', component: ViewGridRaidTask },
          { path: '/app/monitoring/ViewGridRaidRealTime/:realID', component: ViewGridRaidRealTime },
          { path: '/app/monitoring/RoundsTrack/:taskID', component: RoundsTrack },
        ],
      },

      {
        path: '/app/statisticalQuery/leaveCheck',
        component: LeaveCheck,
        name: 'assemble',
      },

      { path: '/app/drill/drillsub', component: Drillsub },
      { path: '/app/assess/officer', component: Officer },
      { path: '/app/dog/feed', component: DogFeed },
      { path: '/app/config/message', component: DeviceInforList },
      { path: '/app/test', component: TestMap },
      {
        path: '/app/drill',
        name: '科学训练',
        component: BearerRoute,
        items: [
          {
            path: '/app/drill/plan',
            component: DrillPlan,
            name: '训练计划',
          },
          { path: '/app/drill/pdogdrill', component: Pdogdrill, name: '警犬计划' },
          { path: '/app/drill/team', component: Team, name: '分组管理' },
          { path: '/app/drill/teamAdd', component: AddTeam },
          { path: '/app/drill/teamEdit', component: AddTeam },
        ],
      },

      {
        path: '/app/drill/planAdd',
        component: AddPlan,
      },
      {
        path: '/app/drill/drillsubAdd',
        component: AddDrillsub,
      },
      {
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
      },
      {
        path: '/app/equipment/materialInfoAdd',
        component: AddGoods,
      },
      {
        path: '/app/equipment/materialInfoEdit',
        component: AddGoods,
      },
      {
        path: '/app/equipment/carInfoAdd',
        component: AddCar,
      },
      {
        path: '/app/equipment/carInfoEdit',
        component: AddCar,
      },
      { path: '/app/dog/breed', component: BreedInfo },
      {
        path: '/app/dog/reproduce',
        component: BreedInfo,
      },
      {
        path: '/app/dog/reproduceAdd',
        component: BreedAdd,
      },
      {
        path: '/app/dog/reproduceEdit/:id',
        component: EditDogChildren,
      },
      { path: '/app/dog/breedAdd', component: BreedAdd },
      { path: '/app/dog/breedEdit', component: BreedAdd },

      { path: '/app/duty/dutyWeek', component: ScheduleManage },
      { path: '/app/duty/groupInfo', component: GroupSchedule },
      { path: '/app/duty/groupInfoAdd', component: AddGropSchedule },
      { path: '/app/duty/groupInfoEdit', component: AddGropSchedule },
      { path: '/app/duty/groupInfoDetail', component: AddGropSchedule },
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
      },
      {
        path: '/app/room/infoEdit',
        component: RoomEdit,
      },
      {
        path: '/app/room/infoAdd',
        component: RoomEdit,
      },
      {
        path: '/app/room/infoDetail',
        component: RoomEdit,
      },
      {
        path: '/app/equipment/video',
        component: Video,
      },
      {
        path: '/app/equipment/videoDetail',
        component: AddVideo,
      },
      {
        path: '/app/equipment/videoAdd',
        component: AddVideo,
      },
      {
        path: '/app/equipment/videoEdit',
        component: AddVideo,
      },
      {
        path: '/app/duty/dutyWeekSchedule',
        component: SmartSchedule,
      },
      {
        path: '/app/assess/performance',
        component: PerformanceAppraisal,
      },
      {
        path: '/app/assess/performanceDetail',
        component: PerformanceDetailTable,
      },
      {
        path: '/app/user',
        name: '用户管理',
        component: BearerRoute,
        items: [
          {
            path: '/app/user/menuList',
            component: MenuInfo,
            name: '菜单列表',
          },
          {
            path: '/app/user/organList',
            component: OrganList,
            name: '机构列表',
          },
          {
            path: '/app/user/sysTree',
            component: SysTreeList,
            name: '系统树',
          },
          {
            path: '/app/user/roleList',
            component: RoleInfo,
            name: '角色列表',
          },
          {
            path: '/app/user/info',
            component: BearerRoute,
            name: '用户列表',
            items: [
              {
                path: '/app/user/info/list',
                component: UserInfo,
                name: '列表',
              },
              {
                path: '/app/user/info/add',
                component: AddUser,
                name: '新增',
              },
              {
                path: '/app/user/info/view',
                component: AddUser,
                name: '查看',
              },
              {
                path: '/app/user/info/edit',
                component: AddUser,
                name: '编辑',
              },
            ],
          },
        ],
      },

      {
        path: '/app/dog/info',
        component: DogInfo,
      },
      {
        path: '/app/dog/infoAdd',
        component: AddDog,
      },
      {
        path: '/app/dog/infoView',
        component: DogInfoView,
      },
      {
        path: '/app/dog/infoEdit',
        component: AddDog,
      },
      {
        path: '/app/dog/prevention',
        component: DogPrevention,
      },
      {
        path: '/app/dog/preventionAdd',
        component: AddPrevention,
      },
      {
        path: '/app/dog/preventionTodo',
        component: ExecutePlan,
      },
      {
        path: '/app/dog/preventionEdit',
        component: AddPrevention,
      },
      {
        path: '/app/dog/preventionView',
        component: ViewPrevention,
      },
      {
        path: '/app/dog/cure',
        component: DogCure,
      },
      {
        path: '/app/dog/cureAdd',
        component: AddCure,
      },
      {
        path: '/app/dog/cureView',
        component: AddCure,
      },
      {
        path: '/app/dog/cureEdit',
        component: AddCure,
      },
      {
        path: '/app/dog/health',
        component: Doghealth,
      },
      {
        path: '/app/monitor/dogHouse',
        component: MonitorDogInfoList,
      },
      {
        path: '/app/car/carList',
        component: CarList,
      },
      {
        path: '/app/car/enterInfoList',
        component: EnterInfoList,
      },
      {
        path: '/app/car/outList',
        component: OutList,
      },

      {
        path: '/app/holiday',
        component: BearerRoute,
        name: '考勤管理',
        items: [
          {
            path: '/app/holiday/attendanceInfor',
            component: AttendanceInfor,
            name: '考勤信息查询',
          },
          {
            path: '/app/holiday/approve',
            component: Approval,
            name: '请假审批',
          },
          {
            path: '/app/holiday/LeaveInformation',
            component: LeaveInformation,
            name: '请假列表',
          },
          {
            path: '/app/holiday/approvalDetail',
            component: ApprovalDetail,
          },
          {
            path: '/app/holiday/attendance',
            component: Call,
            name: '点名记录',
          },
          {
            path: '/app/holiday/holidayList',
            component: HolidayList,
            name: '假期配置',
          },
          { path: '/app/holiday/statistical', component: Attend, name: '考勤统计' },
          {
            path: '/app/holiday/holidayListAdd',
            component: AddHolidayList,
          },
          {
            path: '/app/holiday/holidayListView',
            component: AddHolidayList,
          },
          {
            path: '/app/holiday/holidayListEdit',
            component: AddHolidayList,
          },
        ],
      },
      {
        path: '/app/reportManage',
        component: BearerRoute,
        name: '上报管理',
        items: [
          {
            path: '/app/reportManage/fourReport',
            component: FourReport,
            name: '4w信息上报',
          },
          {
            path: '/app/reportManage/FourReportListSearch',
            component: FourReportListSearch,
            name: '工作用车列表',
          },
          {
            path: '/app/reportManage/AttendanceCar',
            component: AttendanceCar,
            name: '出勤用车列表',
          },
          {
            path: '/app/reportManage/otherThingsReport',
            component: OtherThingsReport,
            name: '其他事物上报',
          },
          {
            path: '/app/reportManage/TeamWorkStatist',
            component: TeamWorkStatist,
            name: '中队工作统计',
          },
          {
            path: '/app/reportManage/TeamWorkStatistDetal',
            component: TeamWorkStatistDetal,
            name: '中队任务详细列表',
          },
          {
            path: '/app/reportManage/OwnWorkStatiseDetal',
            component: OwnWorkStatiseDetal,
            name: '个人任务详情列表',
          },
          {
            path: '/app/reportManage/OwnWorkStatise',
            component: OwnWorkStatise,
            name: '个人工作统计',
          },
          {
            path: '/app/reportManage/ImportFile',
            component: ImportFile,
            name: '导入4w报备',
          },
          {
            path: '/app/reportManage/DailyInformation',
            component: DailyInformation,
            name: '日报列表',
          },
          {
            path: '/app/reportManage/OvertimeInformation',
            component: OvertimeInformation,
            name: '加班列表',
          },
          {
            path: '/app/reportManage/AwardInformation',
            component: AwardInformation,
            name: '奖励列表',
          },
        ],
      },

      {
        path: '/app/performance',
        component: BearerRoute,
        name: '绩效考核',
        items: [
          {
            path: '/app/performance/info',
            component: BearerRoute,
            name: '绩效列表',
            items: [
              {
                path: '/app/performance/info/list',
                component: PerformanceInfo,
                // name: '列表',
              },
              {
                path: '/app/performance/info/view',
                component: PerformanceDetail,
                name: '查看',
              },
            ],
          },

          {
            path: '/app/performance/register',
            component: BearerRoute,
            name: '登记列表',
            items: [
              {
                path: '/app/performance/register/list',
                component: PerformanceRegister,
                name: '列表',
              },
              {
                path: '/app/performance/register/edit',
                component: PerformanceEdit,
                name: '编辑',
              },
            ],
          },
          {
            path: '/app/performance/rule',
            component: PerformanceRule,
            name: '绩效规则',
          },
          {
            path: '/app/performance/assessmentSetting',
            component: PerformanceAssessmentSetting,
            name: '考核指标设置',
          },
          {
            name: '考核列表',
            path: '/app/performance/assessmentList',
            component: BearerRoute,
            requiresAuth: true,
            items: [
              {
                path: '/app/performance/assessmentList/list',
                // exact: true,
                // name: '列表',
                component: PerformanceAssessmentList,
              },
              {
                name: '详情',
                path: '/app/performance/assessmentList/detal',
                component: PerformanceAssessmentDetail,
              },
            ],
          },
          {
            path: '/app/performance/titleSetting',
            component: PerformanceTitleSetting,
            name: '头衔设置',
          },
        ],
      },
      {
        path: '/app/archivew',
        component: BearerRoute,
        name: '档案管理',
        items: [
          {
            path: '/app/archivew/list',
            component: ArchivewList,
            name: '列表',
          },
        ],
      },
    ],
  },
];

export default routerArr;
