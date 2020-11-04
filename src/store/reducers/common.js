import { IS_COLLAPSED, NAV_DATA } from '../actionTypes';

const initialzeState = {
  collapsed: false,
  navData: [],
};

export default function collaspedReducer(state = initialzeState, action) {
  switch (action.type) {
    case IS_COLLAPSED:
      return {
        ...state,
        collapsed: !state.collapsed,
      };
    case NAV_DATA:
      return {
        ...state,
        navData: action.nav,
      };
    default:
      return state;
  }
}
