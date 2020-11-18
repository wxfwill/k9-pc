import asyncComponent from './asyncComponent';
// 首页
import IndexComponent from 'pages/home/NewIndex';

// 网格化搜捕
const DutyComponent = asyncComponent(() => import('pages/monitoring/DutyComponent'));
const Deploy = asyncComponent(() => import('pages/monitoring/Deploy'));
const AddTask = asyncComponent(() => import('pages/monitoring/Deploy/add/AddTask'));
const AddPatrols = asyncComponent(() => import('pages/monitoring/AddPatrols/AddTask'));
const GridRaid = asyncComponent(() => import('pages/monitoring/GridRaid/GridRaid'));
const GridRaidTaskList = asyncComponent(() => import('pages/monitoring/GridRaid/GridRaidTaskList'));
const ViewGridRaidTask = asyncComponent(() => import('pages/monitoring/GridRaid/ViewGridRaidTask'));
const ViewGridRaidRealTime = asyncComponent(() => import('pages/monitoring/GridRaid/ViewGridRaidRealTime'));
const RoundsTrack = asyncComponent(() => import('pages/monitoring/RoundsTrack/RoundsTrack'));

// 科学训练
const Pdogdrill = asyncComponent(() => import('pages/drill/Pdogdrill'));
const Drillsub = asyncComponent(() => import('pages/drill/Drillsub'));
const DrillPlan = asyncComponent(() => import('pages/drill/DrillPlan'));
const AddPlan = asyncComponent(() => import('pages/drill/AddPlan'));
const AddDrillsub = asyncComponent(() => import('pages/drill/AddDrillsub'));
const Team = asyncComponent(() => import('pages/drill/Team'));
const AddTeam = asyncComponent(() => import('pages/drill/AddTeam'));

// 日常养护
//犬只管理
const DogInfo = asyncComponent(() => import('pages/dogManage/dogInfor/DogInfo'));
//新增犬只
const AddDog = asyncComponent(() => import('pages/dogManage/dogInfor/AddDogForm'));
const DogInfoView = asyncComponent(() => import('pages/dogManage/dogInfor/DogInfoView'));
//犬病防治数据展示
const DogPrevention = asyncComponent(() => import('pages/dogManage/dogPrevention/DogPrevention'));
//新增犬病防治
const AddPrevention = asyncComponent(() => import('pages/dogManage/dogPrevention/AddPreventionForm'));
const ExecutePlan = asyncComponent(() => import('pages/dogManage/dogPrevention/ExecutePlan'));
//犬病治疗数据展示
const DogCure = asyncComponent(() => import('pages/dogManage/dogCure/DogCure'));
//新增犬病治疗
const AddCure = asyncComponent(() => import('pages/dogManage/dogCure/AddCureForm'));
const BreedInfo = asyncComponent(() => import('pages/dogManage/breed/BreedInfo'));
const BreedAdd = asyncComponent(() => import('pages/dogManage/breed/BreedAdd'));
const EditDogChildren = asyncComponent(() => import('pages/dogManage/breed/EditDogChildren'));

//绩效考核
const PerformanceInfo = asyncComponent(() => import('pages/performance/Info/index'));
const PerformanceRule = asyncComponent(() => import('pages/performance/Rule/index'));
const PerformanceRegister = asyncComponent(() => import('pages/performance/Register/index'));
const PerformanceDetail = asyncComponent(() => import('pages/performance/Register/RegisterDetail'));
const PerformanceEdit = asyncComponent(() => import('pages/performance/Register/RegisterEdit'));
const PerformanceAssessmentSetting = asyncComponent(() => import('pages/performance/AssessmentSetting/index'));
// const PerformanceAssessmentDetail = asyncComponent(() => import('pages/performance/AssessmentSetting/detail'));
const PerformanceAssessmentList = asyncComponent(() => import('pages/performance/AssessmentList/index'));
const PerformanceAssessmentDetail = asyncComponent(() => import('pages/performance/AssessmentList/detail'));
const PerformanceTitleSetting = asyncComponent(() => import('pages/performance/TitleSetting/index'));

// 智能排版
const ScheduleManage = asyncComponent(() => import('pages/scheduleManage/ScheduleManage'));
const SmartSchedule = asyncComponent(() => import('pages/scheduleManage/SmartSchedule'));
//排班人员管理
const GroupSchedule = asyncComponent(() => import('pages/scheduleManage/GroupSchedule'));
const AddGropSchedule = asyncComponent(() => import('pages/scheduleManage/AddGropSchedule'));

//考勤管理
const HolidayList = asyncComponent(() => import('pages/holiday/HolidayList/index'));
const AddHolidayList = asyncComponent(() => import('pages/holiday/HolidayList/AddHolidayList'));
const Approval = asyncComponent(() => import('pages/holiday/Approval/index'));
const ApprovalDetail = asyncComponent(() => import('pages/holiday/Approval/ApprovalDetail'));
//点名
const Call = asyncComponent(() => import('pages/holiday/Call/index'));

//基础数据 犬舍管理
const RoomInfo = asyncComponent(() => import('pages/baseData/dogHouse/Room'));
const RoomEdit = asyncComponent(() => import('pages/baseData/dogHouse/RoomEdit'));
//基础数据 智能颈环
const Bracelet = asyncComponent(() => import('pages/baseData/bracelet/Bracelet'));
const BraceletEdit = asyncComponent(() => import('pages/baseData/bracelet/BraceletEdit'));

//新版本--用户管理

// 用户列表
const UserInfo = asyncComponent(() => import('pages/userManage/user/UserInfo'));
const AddUser = asyncComponent(() => import('pages/userManage/user/addUserForm'));
// 角色列表
const RoleInfo = asyncComponent(() => import('pages/userManage/role/List'));
// 菜单维护
const MenuInfo = asyncComponent(() => import('pages/userManage/menu/index'));

// 新版--上报统计
// 上报
const FourReport = asyncComponent(() => import('pages/reportManage/FourReport/index'));
// 信息查询
const FourReportListSearch = asyncComponent(() => import('pages/reportManage/FourReportListSearch/index'));
// 其他事物上报
const OtherThingsReport = asyncComponent(() => import('pages/reportManage/OtherThingsReport/index'));
// 中队统计
const TeamWorkStatist = asyncComponent(() => import('pages/reportManage/TeamWorkStatist'));
const TeamWorkStatistDetal = asyncComponent(() => import('pages/reportManage/TeamWorkStatist/DetalList'));
// 个人统计
const OwnWorkStatise = asyncComponent(() => import('pages/reportManage/OwnWorkStatise'));
const OwnWorkStatiseDetal = asyncComponent(() => import('pages/reportManage/OwnWorkStatise/TaskDetalList'));

//导入4W报备
const ImportFile = asyncComponent(() => import('pages/reportManage/ImportFile'));
//日报信息查询
const DailyInformation = asyncComponent(() => import('pages/reportManage/DailyInformation'));
//请假/离深/补休信息查询
const LeaveInformation = asyncComponent(() => import('pages/reportManage/LeaveInformation'));
//加班/夜班信息查询
const OvertimeInformation = asyncComponent(() => import('pages/reportManage/OvertimeInformation'));
//奖励信息查询
const AwardInformation = asyncComponent(() => import('pages/reportManage/AwardInformation'));

const Officer = asyncComponent(() => import('components/view/assess/Officer'));
const DogFeed = asyncComponent(() => import('components/view/dog/DogFeed'));
const DeviceInforList = asyncComponent(() => import('components/view/deviceManage/DeviceInforList'));
const TestMap = asyncComponent(() => import('components/view/test/TestMap'));
const Attend = asyncComponent(() => import('components/view/attend/Attend'));

const PerformanceAppraisal = asyncComponent(() => import('components/admin/performanceAppraisal/Performance'));
const PerformanceDetailTable = asyncComponent(() =>
  import('components/admin/tables/performanceAppraisal/PerformanceDetailTable')
);

// 犬舍监控信息卡片列表
const MonitorDogInfoList = asyncComponent(() => import('components/admin/monitordog/MonitorDogInfoList/index'));

//查看/编辑犬病防治
const ViewPrevention = asyncComponent(() => import('components/admin/tables/DogManage/PreventionDetailTable'));

// 视频管理
const Video = asyncComponent(() => import('components/admin/video/Video'));
const VideoInfo = asyncComponent(() => import('components/admin/video/VideoInfo'));
const AddVideo = asyncComponent(() => import('components/admin/video/addVideo'));

// 场地管理
const TrainPlace = asyncComponent(() => import('components/admin/trainPlace/TrainPlace'));
const TrainPlaceEdit = asyncComponent(() => import('components/admin/trainPlace/TrainPlaceEdit'));

// UWB
const Uwb = asyncComponent(() => import('components/admin/uwb/Uwb'));
const UwbEdit = asyncComponent(() => import('components/admin/uwb/UwbEdit'));
// 犬只健康
const Doghealth = asyncComponent(() => import('components/view/dog/DogHealth'));
const CarList = asyncComponent(() => import('components/admin/cardInfo/CarInfo'));
const EnterInfoList = asyncComponent(() => import('components/admin/cardInfo/EnterInfoList'));
const OutList = asyncComponent(() => import('components/admin/cardInfo/OutList'));
const AddCar = asyncComponent(() => import('components/admin/cardInfo/AddCar'));
const Goods = asyncComponent(() => import('components/admin/goods/Goods'));
const AddGoods = asyncComponent(() => import('components/admin/goods/AddGoods'));
const EsayTask = asyncComponent(() => import('components/admin/monitordog/EsayTask/index'));
const LeaveCheck = asyncComponent(() => import('components/admin/monitordog/LeaveCheck/index'));
const EsayTaskAdd = asyncComponent(() => import('components/admin/monitordog/EsayTask/EsayTaskAdd'));
const Assemble = asyncComponent(() => import('components/admin/monitordog/assemble/index'));
const AssembleAdd = asyncComponent(() => import('components/admin/monitordog/assemble/AssembleAdd'));

const routerArr = [
  { path: '/app/home/index', component: IndexComponent, meta: { name: '首页' } },
  { path: '/app/monitoring/duty', component: DutyComponent },
  { path: '/app/monitoring/deploy', component: Deploy, meta: { name: '紧急调配' } },
  {
    path: '/app/monitoring/assemble',
    component: Assemble,
  },
  {
    path: '/app/monitoring/assembleAdd',
    component: AssembleAdd,
  },
  {
    path: '/app/statisticalQuery/leaveCheck',
    component: LeaveCheck,
  },
  {
    path: '/app/monitoring/itinerancy',
    component: EsayTask,
  },
  {
    path: '/app/monitoring/itinerancyAdd',
    component: EsayTaskAdd,
  },
  {
    path: '/app/monitoring/itinerancyEdit',
    component: EsayTaskAdd,
  },
  { path: '/app/monitoring/deployAdd', component: AddTask },
  {
    path: '/app/monitoring/dutyAdd', // 新增日常巡逻
    component: AddPatrols,
  },
  {
    path: '/app/monitoring/dutyEdit', // 编辑日常巡逻
    component: AddPatrols,
  },
  { path: '/app/monitoring/grid', component: GridRaidTaskList },
  { path: '/app/monitoring/addGrid', component: GridRaid },
  { path: '/app/monitoring/ViewGridRaidTask/:taskID', component: ViewGridRaidTask },
  { path: '/app/monitoring/ViewGridRaidRealTime/:realID', component: ViewGridRaidRealTime },
  { path: '/app/drill/pdogdrill', component: Pdogdrill },
  { path: '/app/drill/drillsub', component: Drillsub },
  { path: '/app/assess/officer', component: Officer },
  { path: '/app/dog/feed', component: DogFeed },
  { path: '/app/config/message', component: DeviceInforList },
  { path: '/app/test', component: TestMap },
  { path: '/app/statisticalQuery/attendance', component: Attend },
  { path: '/app/monitoring/RoundsTrack/:taskID', component: RoundsTrack },
  {
    path: '/app/drill/plan',
    component: DrillPlan,
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
  { path: '/app/drill/team', component: Team },
  { path: '/app/drill/teamAdd', component: AddTeam },
  { path: '/app/drill/teamEdit', component: AddTeam },
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
    path: '/app/user/menuList',
    component: MenuInfo,
  },
  {
    path: '/app/user/roleList',
    component: RoleInfo,
  },
  {
    path: '/app/user/info',
    component: UserInfo,
  },
  {
    path: '/app/user/infoAddUser',
    component: AddUser,
  },
  {
    path: '/app/user/infoUserData',
    component: AddUser,
  },
  {
    path: '/app/user/infoEditUser',
    component: AddUser,
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
    path: '/app/holiday/attendance',
    component: Call,
  },
  {
    path: '/app/holiday/holidayList',
    component: HolidayList,
  },
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
    path: '/app/holiday/approve',
    component: Approval,
  },
  {
    path: '/app/holiday/approvalDetail',
    component: ApprovalDetail,
  },
  {
    path: '/app/performance',
    component: PerformanceRule,
    breadcrumb: '绩效管理',
    items: [
      {
        path: '/app/performance/rule',
        component: PerformanceRule,
        breadcrumb: '规则',
      },
      {
        path: '/app/performance/register',
        component: PerformanceRegister,
      },
      {
        path: '/app/performance/registerDetail',
        component: PerformanceDetail,
      },
      {
        path: '/app/performance/info',
        component: PerformanceInfo,
      },
      {
        path: '/app/performance/registerEdit',
        component: PerformanceEdit,
      },
      {
        path: '/app/performance/assessmentSetting',
        component: PerformanceAssessmentSetting,
      },
      {
        path: '/app/performance/titleSetting',
        component: PerformanceTitleSetting,
      },
      {
        path: '/app/performance/assessmentList',
        component: PerformanceAssessmentList,
        breadcrumb: '绩效考核信息列表',
        items: [
          {
            breadcrumb: '详情',
            path: '/app/performance/assessmentListDetail',
            component: PerformanceAssessmentDetail,
            exact: true,
          },
        ],
      },
    ],
  },
  // {
  //   path: '/app/performance/rule',
  //   component: PerformanceRule,
  // },
  // {
  //   path: '/app/performance/register',
  //   component: PerformanceRegister,
  // },
  // {
  //   path: '/app/performance/registerDetail',
  //   component: PerformanceDetail,
  // },
  // {
  //   path: '/app/performance/info',
  //   component: PerformanceInfo,
  // },
  // {
  //   path: '/app/performance/registerEdit',
  //   component: PerformanceEdit,
  // },
  // {
  //   path: '/app/performance/assessmentSetting',
  //   component: PerformanceAssessmentSetting,
  // },
  // {
  //   path: '/app/performance/assessmentListDetail',
  //   component: PerformanceAssessmentDetail,
  // },
  // {
  //   path: '/app/performance/assessmentList',
  //   component: PerformanceAssessmentList,
  //   meta: {
  //     name: '绩效考核信息列表',
  //   },
  // },
  // {
  //   path: '/app/performance/titleSetting',
  //   component: PerformanceTitleSetting,
  // },
  {
    path: '/app/reportManage/fourReport',
    component: FourReport,
  },
  {
    path: '/app/reportManage/FourReportListSearch',
    component: FourReportListSearch,
  },
  {
    path: '/app/reportManage/otherThingsReport',
    component: OtherThingsReport,
  },
  {
    path: '/app/reportManage/TeamWorkStatist',
    component: TeamWorkStatist,
  },
  {
    path: '/app/reportManage/TeamWorkStatistDetal',
    component: TeamWorkStatistDetal,
    meta: {
      name: '团队任务详情列表',
    },
  },
  {
    path: '/app/reportManage/OwnWorkStatiseDetal',
    component: OwnWorkStatiseDetal,
    meta: {
      name: '个人任务详情列表',
    },
  },
  {
    path: '/app/reportManage/OwnWorkStatise',
    component: OwnWorkStatise,
  },
  {
    path: '/app/reportManage/ImportFile',
    component: ImportFile,
  },
  {
    path: '/app/reportManage/DailyInformation',
    component: DailyInformation,
  },
  {
    path: '/app/reportManage/LeaveInformation',
    component: LeaveInformation,
  },
  {
    path: '/app/reportManage/OvertimeInformation',
    component: OvertimeInformation,
  },
  {
    path: '/app/reportManage/AwardInformation',
    component: AwardInformation,
  },
];

export default routerArr;
