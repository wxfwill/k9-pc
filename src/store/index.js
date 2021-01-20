import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
// import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import loginReducer from './reducers/loginReducer';
import socketReducer from './reducers/websocketReducer';
import commonReducer from './reducers/common';
import userReducer from './reducers/userReducer';

// redux持久化
import {persistStore, persistReducer} from 'redux-persist';
// import storageSession from 'redux-persist/lib/storage/session';
import storage from 'redux-persist/lib/storage';
// const logger = process.env.NODE_ENV == 'development' ? createLogger : '';
const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  loginReducer,
  socketReducer,
  commonReducer,
  userReducer
});
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['loginReducer', 'socketReducer', 'commonReducer', 'userReducer'] // 白名单
};

const myPersistReducer = persistReducer(persistConfig, rootReducer);

const initialzeSate = {};

const store = createStore(myPersistReducer, initialzeSate, composeEnhancers(applyMiddleware(...middleware)));
// const store = createStore(myPersistReducer, initialzeSate, applyMiddleware(...middleware));

export const persistor = persistStore(store);

export default store;
