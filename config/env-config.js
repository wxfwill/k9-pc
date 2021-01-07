const ENV_LIST = [
  {
    envName: 'local', // 本地
    apiUrl: 'http://172.16.121.137:8030',
    webUrl: 'http://localhost:8001'
  },
  {
    envName: 'dev', // build--开发
    apiUrl: 'http://172.16.121.137:8030',
    webUrl: 'http://172.16.121.137:8010'
  },
  {
    envName: 'test', // build--测试
    apiUrl: 'http://172.16.121.137:8080',
    webUrl: 'http://172.16.121.137:8000'
  },
  {
    envName: 'pro', // build--生产
    apiUrl: 'http://k9pc.hcfdev.cn',
    webUrl: 'http://k9pc.hcfdev.cn'
  },
  {
    envName: 'analy', // analy
    apiUrl: 'http://172.16.121.137:8080',
    webUrl: 'http://172.16.121.137:8000'
  }
];
const argv = JSON.parse(process.env.npm_config_argv).original || process.argv;
const HOST_ENV = argv[2] ? argv[2].replace(/[^a-z]+/gi, '') : '';
//没有设置环境，则默认为第一个
const HOST_CONF = HOST_ENV ? ENV_LIST.find((item) => item.envName === HOST_ENV) : ENV_LIST[0];
console.log(HOST_CONF);

// 把环境常量挂载到process.env方便客户端使用
process.env.BASE_URL = HOST_CONF.apiUrl;
process.env.BASE_ENV = HOST_CONF.envName;
process.env.BASE_WEB_URL = HOST_CONF.webUrl;

module.exports.HOST_CONF = HOST_CONF;
module.exports.ENV_LIST = ENV_LIST;
