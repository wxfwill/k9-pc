import { combineReducers } from 'redux';
import login from './login';
import system from './system';

const rootReducer = combineReducers({
	login,
	system
})

export default rootReducer;