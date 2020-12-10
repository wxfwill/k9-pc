import React from 'react';
import { render } from 'react-dom';
// import Routes from './router/router';

import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import routerArr from './router/allRouter';
// import { renderRoutes } from 'react-router-config';
import renderRoutes from './router/renderRoutes';

//react-hot-loader
// import { AppContainer } from 'react-hot-loader';

const authed = false; // 如果登陆之后可以利用redux修改该值(关于redux不在我们这篇文章的讨论范围之内）
const authPath = '/login'; // 默认未登录的时候返回的页面，可以自行设置

// redux
import { Provider } from 'react-redux';
import store from './store/index';

// redux持久化
import { persistor } from './store/index';
import { PersistGate } from 'redux-persist/lib/integration/react';

// http
import api from './http/index';
React.$ajax = api;
import httpAjax from 'libs/httpAjax';
React.httpAjax = httpAjax;
React.store = store;

//汉化包
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import 'moment/locale/zh-cn';

// 样式
import 'antd/dist/antd.less';
require('style/App.less');
require('normalize.css');

// 打印
require('libs/util/print');

// 模块热替换
const App = {
  run: function (renderRoute) {
    render(
      // <AppContainer>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <ConfigProvider locale={zh_CN}>
            <HashRouter>{renderRoute(routerArr, authed, authPath)}</HashRouter>
          </ConfigProvider>
        </Provider>
      </PersistGate>,
      // </AppContainer>,
      document.getElementById('root')
    );
  },
};

App.run(renderRoutes);

if (module.hot) {
  // module.hot.accept();
  module.hot.accept('./router/allRouter', () => {
    App.run(renderRoutes);
  });
}

// class App extends React.Component {
//   render() {
//     return (
//       <PersistGate loading={null} persistor={persistor}>
//         <Provider store={store}>
//           <ConfigProvider locale={zh_CN}>
//             {/* <Routes /> */}
//             <HashRouter>
//               {renderRoutes(routerArr, authed, authPath)}
//               {/* <Switch>{renderRoutes(routerArr, authed, authPath)}</Switch> */}
//             </HashRouter>
//           </ConfigProvider>
//         </Provider>
//       </PersistGate>
//     );
//   }
// }

// ReactDOM.render(<App />, document.getElementById('root'));
