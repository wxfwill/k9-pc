import { message, Button, Alert } from 'antd';
const LogoSrc = require('images/logo.png');
const LogoPng = require('images/left-logo.png');
import moment from 'moment';
message.config({
  duration: 3,
});
//---start---泛化this(函数反柯里化)---start
Function.prototype.uncurrying = function () {
  let self = this;
  return function () {
    let obj = Array.prototype.shift.call(arguments); //原对象（数组，类数组）
    return self.apply(obj, arguments);
  };
};
//泛化数组对象方法
let ArrMethod = {};
for (var i = 0, fn, ary = ['push', 'shift', 'forEach', 'concat']; (fn = ary[i++]); ) {
  ArrMethod[fn] = Array.prototype[fn].uncurrying();
}
//---end---泛化this(函数反柯里化)---end
let constant = {
  name: 'K9 警犬作战指挥系统',
  LogoSrc: LogoSrc,
  LogoPng: LogoPng,
  logoText: 'K9 警犬作战指挥系统',
  footerText: 'K9 警犬作战指挥系统©2018 Created by 华云中盛',
};
let Msg = {
  warning: (text) => message.warning(text),
};
let cookieUtil = {
  get: function (name) {
    let cookieName = encodeURIComponent(name) + '=',
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null;
    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  },
  set: function (name, value, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += ';expires=' + expires.toGMTString();
    }
    if (path) {
      cookieText += ';path=' + path;
    }
    if (domain) {
      cookieText += ';domain=' + domain;
    }
    if (secure) {
      cookieText += ';secure';
    }
    document.cookie = cookieText;
  },
  unset: function (name, path, domain, secure) {
    this.set(name, '', new Date(0), path, domain, secure);
  },
};
let method = {
  isObjectValueEqual: function (a, b) {
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      return false;
    }
    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  },
  verifyType: function () {
    function isType(type) {
      return function (obj) {
        return Object.prototype.toString.call(obj) == '[object ' + type + ']';
      };
    }
    return {
      isString: isType('String'),
      isArray: isType('Array'),
      isNumber: isType('Number'),
    };
  },
  subsection: function (data, fn, count, time) {
    let timmer = null;
    function start() {
      let preCoord = data.slice(0, 1);
      for (var i = 0; i < Math.min(count || 1, data.length); i++) {
        var obj = data.splice(0, 2);
        fn([...obj, data[0]]);
      }
    }
    return function () {
      timmer = setInterval(function () {
        if (data.length === 0) {
          clearInterval(timmer);
        }
        start();
      }, time);
    };
  },
  throttle: function (fn, interval) {
    let _self = fn;
    var timmer;
    let isFirst = true;
    return function () {
      let args = arguments;
      let _me = this;
      if (isFirst) {
        fn.apply(_me, args);
        return (isFirst = false);
      }
      if (timmer) {
        return false;
      }
      timmer = setTimeout(function () {
        clearTimeout(timmer);
        timmer = null;
        fn.apply(_me, args);
      }, 500 || interval);
    };
  },
  ArrMetho: ArrMethod,
};

//打印
export const jQPrintPartialHtml = (select, { title = document.title } = {}) => {
  window.Print(select, {
    title: title,
    onStart: () => {
      console.log('onStart', new Date());
    },
    onEnd: () => {
      console.log('onEnd', new Date());
    },
  });
};

/* 格式化时间戳
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
// 获取url参数
export const urlParse = (src) => {
  let url = decodeURIComponent(src) || null;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url && url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      let temArr = item.substring(1).split('=');
      let key = temArr[0];
      let val = temArr[1];
      obj[key] = val;
    });
  }
  return obj;
};
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export const Debounce = (func, wait = 500, immediate = true) => {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
};
/**
 * a 标签下载
 * 文件流的形式 blob
 * res 后台返回的文件流
 * file 当前文件
 */
export const createFileDown = (res, file) => {
  if (!res) {
    throw new Error('获取的文件流为空');
  }
  const content = res;
  const blob = new Blob([content]);
  console.log('blob====123');
  console.log(blob);
  const fileName = file.name || file;
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName);
  }
};

// 判断是否为数组
export const isObject = (ele) => {
  if (Object.prototype.toString.call(ele) == '[object Object]') {
    return true;
  } else {
    return false;
  }
};

// 根据年月计算出一个月的开始和结束日期
export const getMontDateRange = (year, month) => {
  let startDate = moment([Number(year), Number(month) - 1]);
  let endDate = moment(startDate).endOf('month');
  return { start: moment(startDate).format('YYYY-MM-DD'), end: moment(endDate).format('YYYY-MM-DD') };
};

// 开始时间和结束时间之间的小时
export const getStartEndHours = (start, end) => {
  let s = moment(start);
  let e = moment(end);
  // let dura = e - s;
  return e.diff(s, 'hours', ture);
};

export { constant, Msg, method, cookieUtil };
