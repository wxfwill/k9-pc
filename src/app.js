import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './router/router';

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
import 'moment/locale/zh-cn';

// 样式
import 'antd/dist/antd.less';
import 'element-theme-default';
require('style/App.less');
require('normalize.css');

class App extends React.Component {
  render() {
    return (
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <ConfigProvider locale={zh_CN}>
            <Routes />
          </ConfigProvider>
        </Provider>
      </PersistGate>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
