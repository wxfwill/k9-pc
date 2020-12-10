// 兼容旧的页面
let localUrl, apiUrl, ws;
if (process.env.NODE_ENV == 'development') {
  // 本地开发
  localUrl = 'http://localhost:8001';
  // apiUrl = "http://172.16.121.137:8080";
  apiUrl = 'http://172.16.121.137:8030';
  ws = 'ws://172.16.121.137:8080';
} else if (process.env.NODE_ENV == 'production') {
  // 测试
  localUrl = 'http://172.16.121.137:8080';
  apiUrl = 'http://172.16.121.137:8080';
  // 生产
  // localUrl = 'http://k9pc.hcfdev.cn';
  // apiUrl = 'http://k9pc.hcfdev.cn';
  ws = 'ws://172.16.121.137:8080';
}

module.exports = {
  localUrl,
  apiUrl,
  ws,
};
