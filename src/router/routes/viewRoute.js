import React, { Component } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import asyncComponent from '../asyncComponent';

const IndexComponent =  asyncComponent(() => import('components/view/home/NewIndex'));
const DutyComponent = asyncComponent(()=>import('components/view/monitoring/DutyComponent'));
const Deploy = asyncComponent(()=>import("components/view/monitoring/Deploy"));
const AddTask = asyncComponent(()=>import('components/view/monitoring/Deploy/add/AddTask'));
// 新增日常巡逻任务
const AddPatrols = asyncComponent(()=>import('components/view/monitoring/AddPatrols/AddTask'));
const GridRaid  = asyncComponent(()=>import('components/view/monitoring/GridRaid/GridRaid'));
const GridRaidTaskList  = asyncComponent(()=>import('components/view/monitoring/GridRaid/GridRaidTaskList'));
const ViewGridRaidTask = asyncComponent(()=>import('components/view/monitoring/GridRaid/ViewGridRaidTask'));
const Pdogdrill = asyncComponent(()=>import('components/view/drill/Pdogdrill'));
const Drillsub = asyncComponent(()=>import('components/view/drill/Drillsub'));
const DogPrev = asyncComponent(()=>import('components/view/dog/DogPrev'));
// const DogCure = asyncComponent(()=>import('components/view/dog/DogCure'));
const Officer = asyncComponent(()=>import('components/view/assess/Officer'));
const DogFeed = asyncComponent(()=>import('components/view/dog/DogFeed'));
const DeviceInforList = asyncComponent(()=>import('components/view/deviceManage/DeviceInforList'));
const TestMap =  asyncComponent(()=>import('components/view/test/TestMap'));
const Attend = asyncComponent(()=>import('components/view/attend/Attend'))
const RoundsTrack=asyncComponent(()=>import('components/view/monitoring/RoundsTrack/RoundsTrack'));
const DogCure=asyncComponent(()=>import('components/admin/dogManage/dogCure/DogCure'));
const AddCure=asyncComponent(()=>import('components/admin/dogManage/dogCure/AddCureForm'));
const DogPrevention=asyncComponent(()=>import('components/admin/dogManage/dogPrevention/DogPrevention'));
//新增犬病防治
const AddPrevention=asyncComponent(()=>import('components/admin/dogManage/dogPrevention/AddPreventionForm'));
const ExecutePlan = asyncComponent(()=>import('components/admin/dogManage/dogPrevention/ExecutePlan'));
const ViewPrevention=asyncComponent(()=>import('components/admin/tables/DogManage/PreventionDetailTable'));

const DrillPlan = asyncComponent(()=>import('components/view/drill/DrillPlan'));
const AddPlan = asyncComponent(()=>import('components/view/drill/AddPlan'));
const AddDrillsub = asyncComponent(()=>import('components/view/drill/AddDrillsub'));

const routes = [
  { path: '/view/home/index',
    component: IndexComponent
  },
  { path: '/view/monitoring/duty',
    component: DutyComponent
  },
  { path: '/view/monitoring/grid',
    component: GridRaidTaskList
  },
  { path: '/view/monitoring/addGrid',
    component: GridRaid
  },
  { path: '/view/drill/pdogdrill',
    component: Pdogdrill
  },
  { path: '/view/drill/drillsub',
    component: Drillsub
  }, {
    path: '/view/drill/plan',
    component: DrillPlan,

  },{
    path: '/view/drill/planAdd',
    component: AddPlan,

  },
  {
    path: '/view/drill/planEdit',
    component: AddPlan,

  },
  {
    path: '/view/drill/drillsubAdd',
    component: AddDrillsub,
  },
  // { path: '/view/dog/prevention',
  //   component: DogPrev
  // },

  {
    path:'/view/dog/prevention',
    component:DogPrevention
  },{
    path:'/view/dog/preventionAdd',
    component:AddPrevention
  },{
    path:'/view/dog/preventionTodo',
    component:ExecutePlan
  },
  {
    path:'/view/dog/preventionEdit',
    component:AddPrevention
  },{
    path:'/view/dog/preventionView',
    component:ViewPrevention
  },

  { path: '/view/dog/cure',
    component: DogCure
  }, {
    path: '/view/dog/cureView',
    component: AddCure
  },
  {
    path: '/view/dog/cureEdit',
    component: AddCure
  },
  {
    path: '/view/dog/cureAdd',
    component: AddCure
  },
  { path: '/view/monitoring/deploy',
    component: Deploy
  },
  { path: '/view/monitoring/deployAdd',
    component: AddTask
  },
  { path: '/view/assess/officer',
    component: Officer
  },
  { path: '/view/dog/feed',
    component: DogFeed
  },
  { path: '/view/config/message',
    component: DeviceInforList
  },
  { path: '/view/statisticalQuery/attendance',
    component: Attend
  },
  { path: '/view/test',
    component: TestMap
  },
  { path: '/view/monitoring/RoundsTrack/:taskID',
    component: RoundsTrack
  },
  { path: '/view/monitoring/ViewGridRaidTask/:taskID',
    component: ViewGridRaidTask
  },
  { path: '/view/monitoring/dutyAdd', // 新增日常巡逻
    component: AddPatrols
  }
]

const RouteWithSubRoutes = (route) => (
  <Route exact path={route.path} render={props => (
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