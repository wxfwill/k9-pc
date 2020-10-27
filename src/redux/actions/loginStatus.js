import * as types from 'constants/LoginStatus';


export const success = (user, msgList) =>({type:types.LOGIN_SUCCESS,user, msgList});
export const error = (text) => ({type:types.LOGIN_ERROR,text});
