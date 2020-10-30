import { message, Button, Alert } from 'antd';
const LogoSrc = require('images/logo.png');
const LogoPng = require('images/left-logo.png');
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

// 判断是否为数组
export const isObject = (ele) => {
  if (Object.prototype.toString.call(ele) == '[object Object]') {
    return true;
  } else {
    return false;
  }
};

export { constant, Msg, method, cookieUtil };
/*
module.exports = {
	constant,
	Msg,
	method,
  cookieUtil
};*/
