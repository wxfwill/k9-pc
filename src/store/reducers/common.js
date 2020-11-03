import { IS_COLLAPSED } from '../actionTypes';

const initialzeState = {
  collapsed: false,
};

export default function collaspedReducer(state = initialzeState, action) {
  switch (action.type) {
    case IS_COLLAPSED:
      return {
        ...state,
        collapsed: !state.collapsed,
      };
    default:
      return state;
  }
}
