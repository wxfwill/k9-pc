let apiUrl = "http://172.16.121.137:8080";
let address = { domains: "http://172.16.121.137:8080" };
let ws = { host: "172.16.121.137:8080" };

process.env.NODE_ENV == "development" ? (apiUrl = "") : (apiUrl = address.domains);

module.exports = {
  apiUrl: apiUrl,
  address,
  host: ws.host,
};
