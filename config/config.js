// let apiUrl = "http://172.16.121.137:8080";
// let address = { domains: "http://172.16.121.137:8080" };
// let ws = { host: "172.16.121.137:8080" };

// process.env.NODE_ENV == "development" ? (apiUrl = "") : (apiUrl = address.domains);

// module.exports = {
//   apiUrl: apiUrl,
//   address,
//   host: ws.host,
// };

let localUrl, apiUrl, ws;
if (process.env.NODE_ENV == "development") {
  // 本地开发
  localUrl = "http://localhost:8001";
  apiUrl = "http://172.16.121.137:8080";
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
