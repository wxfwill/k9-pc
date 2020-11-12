// 接口统一集成
import * as common from './moudules/common';
import * as login from './moudules/login';
import * as home from './moudules/home';
import * as fourManage from './moudules/4wManage';
import * as performance from './moudules/performance';

//通用相关接口 优先
import axios from './axios';

//post
const postData = (url, data) => {
  return axios({
    url: url,
    method: 'post',
    data,
  });
};
// get
const getData = (url, params) => {
  return axios({
    url: url,
    method: 'get',
    params,
  });
};
// flie data post
const fileDataPost = (url, data) => {
  return axios({
    url: url,
    method: 'post',
    data,
    responseType: 'blob',
  });
};

// flie data get
const fileDataGet = (url, params) => {
  return axios({
    url: url,
    method: 'get',
    params,
    responseType: 'blob',
  });
};

// 默认全部导出
export default {
  login,
  home,
  fourManage,
  common,
  performance,
  getData,
  postData,
  fileDataPost,
  fileDataGet,
};
