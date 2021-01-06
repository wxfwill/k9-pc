//绩效老何模块相关接口
import axios from '../axios';

//取消当月资格
export const cancelRank = (data) => {
  return axios({
    url: '/api/performanceCheck/cancelRank',
    method: 'post',
    data
  });
};

// 绩效考核列表
export const listPerformanceCheckRank = (data) => {
  return axios({
    url: '/api/performanceCheck/listPerformanceCheckRank',
    method: 'post',
    data
  });
};

// 绩效考核详情
export const performanceCheckInfo = (data) => {
  return axios({
    url: '/api/performanceCheck/performanceCheckInfo',
    method: 'post',
    data
  });
};

// 保存或修改绩效考核编辑
export const savePerformanceCheckRecord = (data) => {
  return axios({
    url: '/api/performanceCheck/savePerformanceCheckRecord',
    method: 'post',
    data
  });
};

// 删除
export const deletePerformanceCheckRecord = (data) => {
  return axios({
    url: '/api/performanceCheck/deletePerformanceCheckRecord',
    method: 'post',
    data
  });
};

export const getSelectUrlData = (url, data) => {
  return axios({
    url: url,
    method: 'post',
    data
  });
};

// 绩效考核类名信息
export const performanceCheckType = (data) => {
  return axios({
    url: '/api/basicData/performanceCheckType',
    method: 'post',
    data
  });
};
