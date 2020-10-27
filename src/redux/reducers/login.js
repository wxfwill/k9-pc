import {LOGIN_SUCCESS,LOGIN_ERROR} from 'constants/LoginStatus';

const initialState ={
  	type:'normal',
    isLogin: false,
    text: '请输入用户信息！',
    user:null
  };
export default function login(state=initialState,action){
	switch(action.type){
		case LOGIN_SUCCESS:
			return {
				type:'success',
				isLogin: true,
				text: '登录成功！',
				user:{
					...action.user
					},
				msgList: action.msgList || [],
		  	}
		case LOGIN_ERROR:
			return  {
				type:'error',
					isLogin: false,
					text: action.text
				}
		default:
			return state;
	}
}














