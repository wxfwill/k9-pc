//通用数据相关接口
import axios from '../axios';

//查询人员列表
export const getCombatStaff = (data) => {
  return axios({
    url: '/api/userCenter/getCombatStaff',
    method: 'post',
    data,
  });
};

// 查询中队及成员
export const queryGroupUser = (data) => {
  return axios({
    url: '/api/userCenter/queryGroupUser',
    method: 'post',
    data,
  });
};

// 查询所有的中队
export const queryAllGroups = (data) => {
  return axios({
    url: '/api/userCenter/queryAllGroups',
    method: 'post',
    data,
  });
};

// 根据大类名查询该类下的规则
export const queryRulesByRootName = (params) => {
  return axios({
    url: '/api/integral-rule/queryRulesByRootName',
    method: 'get',
    params,
  });
};

// 查询类 /api/integral-rule/queryAll
export const queryAllType = (params) => {
  return axios({
    url: '/api/integral-rule/queryAll',
    method: 'get',
    params,
  });
};

// 地点列表
export const subordinateAreaList = (data) => {
  return axios({
    url: '/api/basicData/subordinateAreaList',
    method: 'post',
    data,
  });
};
