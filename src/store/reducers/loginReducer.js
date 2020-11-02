import { USER_INFO, MENU_LIST, USER_TOKEN } from '../actionTypes';

const initialzeState = {
  menuList: [],
  userInfo: '',
  token: null,
};

export default function accountReducer(state = initialzeState, action) {
  switch (action.type) {
    case USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case MENU_LIST:
      return {
        ...state,
        menuList: action.list,
      };
    case USER_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
}
