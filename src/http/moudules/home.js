// 首页模块相关接口
import axios from '../axios';

export const dogAreaStatistics = (data) => {
  return axios({
    url: '/api/overView/dogAreaStatistics',
    method: 'post',
    data,
  });
};

export const getDogCountNum = () => {
  return axios({
    url: '/api/dog/getDogCountNum',
    method: 'post',
  });
};

export const treatmentSituation = () => {
  return axios({
    url: '/api/overView/treatmentSituation',
    method: 'post',
  });
};

export const listTrainerRank = () => {
  return axios({
    url: '/api/trainCheck/listTrainerRank',
    method: 'post',
  });
};

export const getTrainSituation = () => {
  return axios({
    url: '/api/train/getTrainSituation',
    method: 'post',
  });
};

export const getTodayOnDuty = () => {
  return axios({
    url: '/api/onDuty/getTodayOnDuty',
    method: 'post',
  });
};

export const todayLog = () => {
  return axios({
    url: '/api/overView/todayLog',
    method: 'post',
  });
};

// 下载案件信息
export const downCaseInfo = (params) => {
  return axios({
    url: '/case/download/' + params.id + '?template=' + params.template,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'get',
    responseType: 'blob',
  });
};

export const downDocFile = (params) => {
  //下载post
  return axios({
    url: '/judDoc/download',
    method: 'get',
    responseType: 'blob',
    params,
  });
};
