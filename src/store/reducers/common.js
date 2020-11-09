import { IS_COLLAPSED, NAV_DATA, MENU_HIGH_LINE } from '../actionTypes';

const initialzeState = {
  collapsed: false,
  routeUrl: '/app/home/index',
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
    case MENU_HIGH_LINE:
      return {
        ...state,
        routeUrl: action.url,
      };
    default:
      return state;
  }
}
