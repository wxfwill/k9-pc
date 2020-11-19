//上报管理模块相关接口
import axios from '../axios';

//查询人员列表
export const getCombatStaff = (data) => {
  return axios({
    url: '/api/userCenter/getCombatStaff',
    method: 'post',
    data,
  });
};

// 4w提交上报  create4wReport
export const create4wReport = (data) => {
  return axios({
    //url: '/api/report/create4wReport',
    url:'/api/report/createCarUseReport',
    method: 'post',
    data,
  });
};

// 4w报备信息列表导出
export const export4wReportInfo = (data) => {
  return axios({
    url: '/api/report/export4wReportInfo',
    method: 'post',
    data,
    responseType: 'blob',
  });
};

// 4w报备信息查询列表
export const page4wReportInfo = (data) => {
  return axios({
    url: '/api/report/page4wReportInfo',
    method: 'post',
    data,
  });
};
// 中队统计工作列表
export const statisticGroup = (data) => {
  return axios({
    url: '/api/report/statisticGroup',
    method: 'post',
    data,
  });
};
// 中队统计工作列表-导出
export const exportStatisticGroup = (data) => {
  return axios({
    url: '/api/report/exportStatisticGroup',
    method: 'post',
    data,
    responseType: 'blob',
  });
};
// 中队工作统计明细
export const pageStatisticGroupDetail = (data) => {
  return axios({
    url: '/api/report/pageStatisticGroupDetail',
    method: 'post',
    data,
  });
};
// 中队统计工作列表明细详情-导出
export const exportStatisticGroupDetail = (data) => {
  return axios({
    url: '/api/report/exportStatisticGroupDetail',
    method: 'post',
    data,
    responseType: 'blob',
  });
};
// 个人统计工作列表
export const pageStatisticPersonal = (data) => {
  return axios({
    url: '/api/report/pageStatisticPersonal',
    method: 'post',
    data,
  });
};
// 个人统计工作列表-导出
export const exportStatisticPersonal = (data) => {
  return axios({
    url: '/api/report/exportStatisticPersonal',
    method: 'post',
    data,
    responseType: 'blob',
  });
};

// 个人统计工作列表明细
export const pageStatisticPersonalDetail = (data) => {
  return axios({
    url: '/api/report/pageStatisticPersonalDetail',
    method: 'post',
    data,
  });
};
// 个人统计工作列表明细-导出
export const exportStatisticPersonalDetail = (data) => {
  return axios({
    url: '/api/report/exportStatisticPersonalDetail',
    method: 'post',
    data,
    responseType: 'blob',
  });
};
