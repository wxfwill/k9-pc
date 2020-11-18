let localUrl, apiUrl, ws;
if (process.env.NODE_ENV == "development") {
  // 本地开发
  localUrl = "http://localhost:8001";
  // apiUrl = "http://172.16.121.137:8080";
  apiUrl = "http://172.16.121.137:8085";
  ws = "ws://172.16.121.137:8080";
} else {
  // 测试
  localUrl = "http://172.16.121.137:8080";
  apiUrl = "http://172.16.121.137:8080";
  ws = "ws://172.16.121.137:8080";
}

module.exports = {
  localUrl,
  apiUrl,
  ws,
};
