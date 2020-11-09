import { IS_COLLAPSED, NAV_DATA, MENU_HIGH_LINE } from '../actionTypes';

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

export function changeRoute(url) {
  return {
    type: MENU_HIGH_LINE,
    url,
  };
}
