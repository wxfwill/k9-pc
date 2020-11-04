import { IS_COLLAPSED, NAV_DATA } from '../actionTypes';

export function showNavCollapsed() {
  return {
    type: IS_COLLAPSED,
  };
}

export function changeNavName(nav) {
  return {
    type: NAV_DATA,
    nav,
  };
}
