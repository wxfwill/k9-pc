import axios from 'axios';
import config from './config';
import { message } from 'antd';
import React from 'react';
const history = require('history').createHashHistory();
// 请求次数
let repeat_count = 0;
let loading = null;

import store from '../store/index';

let ajax = function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      method: config.method,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials,
    });

    // request 拦截器
    instance.interceptors.request.use(
      (config) => {
        message.destroy();
        loading = message.loading('加载中...', 0);
        config.headers['k9token'] = store.getState().loginReducer.token ? store.getState().loginReducer.token : null;
        return config;
      },

      (error) => {
        // 请求错误时
        // 异步关闭loading
        new Promise(() => {
          loading();
        });
        // 1. 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          // return instance.request(originalRequest);// 再重复请求一次
        }
        return Promise.reject(error); // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    );

    // response 拦截器
    instance.interceptors.response.use(
      (response) => {
        let data;
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data == undefined) {
          data = JSON.parse(response.request.responseText);
        } else {
          data = response.data;
        }
        const headers = response.headers;
        // 文件下载响应的文件流
        if (headers['content-type'] && headers['content-type'].indexOf('application/octet-stream') > -1) {
          // 异步关闭loading
          new Promise((resolve, reject) => {
            loading();
          });
          console.log('response.data');
          let name = headers['content-disposition'].split(';')[1].split('filename=')[1];
          console.log(decodeURIComponent(name));
          let bobleObj = {
            name: decodeURIComponent(name),
            file: response.data,
          };
          return bobleObj;
        }
        // 异步关闭loading
        new Promise(() => {
          loading();
        });
        // 根据返回的code值来做不同的处理
        if (!data.code || data.code == 0) {
          return data;
        } else if (data.code == 10001) {
          // token 过期
          message.destroy();
          data && message.info(data.msg);
          React.store.dispatch({ type: 'USER_TOKEN', token: null });
          history.push('/login');
          return data;
        } else {
          message.destroy();
          data && message.info(data.msg);
          return data;
        }
      },
      (err) => {
        new Promise((resolve, reject) => {
          loading();
        });
        // var error = JSON.parse(JSON.stringify(err));
        // if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        //   // return instance.request(originalRequest); // 再重复请求一次
        //   // 请求处理
        //   repeat_count++;
        //   if (repeat_count > config.retry) {
        //     repeat_count = 0;
        //     return;
        //   }
        //   // 重新在请求一次
        //   return instance(options)
        //     .then((res) => {
        //       resolve(res);
        //       return false;
        //     })
        //     .catch((error) => {
        //       reject(error);
        //     });
        // }
        return Promise.reject(err);
      }
    );

    // 请求处理
    instance(options)
      .then((res) => {
        resolve(res);
        return false;
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default ajax;
