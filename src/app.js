import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './router/router';

// redux
import { Provider } from 'react-redux';
import store from './store';

// redux持久化
import { persistor } from './store';
import { PersistGate } from 'redux-persist/lib/integration/react';

// http
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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider locale={zh_CN}>
            <Routes />
          </ConfigProvider>
        </PersistGate>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
