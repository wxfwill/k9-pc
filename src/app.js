import React from 'react';
// import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from 'reducers';
import thunk from 'redux-thunk';
import Routes from 'router/router';
import createLogger from 'redux-logger';
//汉化包
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
//react-hot-loader
// import { AppContainer } from 'react-hot-loader';
//redux数据持久化  1 start---
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import 'antd/dist/antd.less';
import 'element-theme-default';
const persistConfig = {
  key: 'root',
  storage,
};
//redux数据持久化  1 end---
process.env.NODE_ENV == 'development' && require('mock/mockData.js');
require('style/App.less');
require('normalize.css');
const logger = process.env.NODE_ENV == 'development' ? createLogger : '';
// const middleware = [thunk, logger];
const middleware = [thunk];
//redux数据持久化 2  start--
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer, applyMiddleware(...middleware));
persistStore(store);
////redux数据持久化 2  end--

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConfigProvider locale={zh_CN}>
          <Routes />
        </ConfigProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
