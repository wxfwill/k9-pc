let localUrl, apiUrl, ws;

const isDev = process.env.NODE_ENV == 'development';
console.log('isDev====' + isDev);

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
  ws = 'ws://172.16.121.137:8080';
}

module.exports = {
  localUrl,
  apiUrl,
  ws,
};
