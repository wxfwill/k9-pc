// let address = { domains: window.location.origin};
// let ws = { host: window.location.hostname+ ':' +window.location.port }
// process.env.NODE_ENV=='development' ? apiUrl = window.location.origin:apiUrl =  window.location.origin

let apiUrl = "http://172.16.121.137:8080";
let address = { domains: "http://172.16.121.137:8080" };
let ws = { host: "172.16.121.137:8080" };

// let apiUrl = 'http://192.168.1.103:8080';
// let address = { domains: 'http://192.168.1.103:8080'};
// let ws = { host: '192.168.1.103:8080' }

process.env.NODE_ENV == "development" ? (apiUrl = "") : (apiUrl = address.domains);

module.exports = {
  apiUrl: apiUrl,
  address,
  host: ws.host,
};
