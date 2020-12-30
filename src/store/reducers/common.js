import { IS_COLLAPSED, NAV_DATA, MENU_HIGH_LINE, GRID_SHOW_MAP } from '../actionTypes';

const initialzeState = {
  collapsed: false,
  routeUrl: '/app/index',
  navData: [],
  isShowGridMap: false,
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
    case GRID_SHOW_MAP:
      return {
        ...state,
        isShowGridMap: action.showMap,
      };
    default:
      return state;
  }
}
