// 接口统一集成
import * as common from './moudules/common';
import * as login from './moudules/login';
import * as home from './moudules/home';
import * as fourManage from './moudules/4wManage';

// 默认全部导出
export default {
  login,
  home,
  fourManage,
  common,
};
