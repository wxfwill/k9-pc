import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { menusAll } from '@/router/menusAll';

// 白名单权限
const myAuth = [
  '/newHome',
  '/toolbox',
  '/Index',
  '/leaderHome',
  '/toolBoxList',
  '/labelManege',
  '/knowledgeMap',
  '/mapAnalysis',
  '/oneClickSearch',
  '/dataRetrieval',
  '/surveyDetail',
  '/noteDetail',
  '/electricFenceDetail',
  '/specialLineDetail',
  '/rentalCarDetail',
  '/alarmDetail',
  '/safeRiskDetail',
  '/related',
  '/caseDetailBak',
];

// 跳转
function redirectTo(props) {
  // console.log('11111');
  // console.log(props);
  // 添加额外参数
  props.location.meta = props.meta;
  let user = sessionStorage.getItem('user');
  // 只要用户没有登录，一律跳转到首页
  if (!user) {
    console.log(user);
    return <Redirect to="/login" />;
  } else {
    // 用户返回登录页时跳转到当前首页
    if (props.path === '/') {
      // let paths = getAllPath();
      // return <Redirect to={paths[0].url} />;
      return <Redirect to="/login" />;
    } else if (myAuth.indexOf(props.path) != -1) {
      return <Route {...props} />;
    } else {
      return <Route {...props} />;
    }
  }
}

// 获取权限
function hasAuth(props) {
  let paths = getAllPath();
  let hasA = false;
  paths.forEach((item) => {
    if (props.path.indexOf(item.url) !== -1) {
      hasA = true;
    }
  });
  return hasA;
}

// 获取所有有权限的路由
function getAllPath() {
  let menus = sessionStorage.getItem('menus') ? JSON.parse(sessionStorage.getItem('menus')) : [];
  let thisMenus = [];
  // 获取有权限的模块
  menus.forEach((item) => {
    menusAll.forEach((item2) => {
      // 积分管理模块只能使用code，其一级页面后台没有存储路由url
      if (item.url === item2.url || item.code === item2.code) {
        thisMenus.push(item2);
      }
    });
  });

  // 获取有权限的子模块地址
  let paths = [];
  thisMenus.forEach((item) => {
    paths.push(item);
    if (item.children) {
      item.children.forEach((item2) => {
        paths.push(item2);
      });
    }
    if (item.list) {
      item.list.forEach((item2) => {
        paths.push(item2);
        if (item2.children) {
          item2.children.forEach((item3) => {
            paths.push(item3);
          });
        }
      });
    }
  });
  return paths;
}

// 是否有权限
const AuthRouter = (props) => {
  // console.log(props);
  return redirectTo(props);
};

export default AuthRouter;
