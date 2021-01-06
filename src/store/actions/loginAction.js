import {USER_INFO, USER_TOKEN, MENU_LIST} from '../actionTypes';

export function saveUserInfo(userInfo) {
  return {
    type: USER_INFO,
    userInfo
  };
}

export function saveMenuList(list) {
  return {
    type: MENU_LIST,
    list
  };
}

export function saveToken(token) {
  return {
    type: USER_TOKEN,
    token
  };
}
