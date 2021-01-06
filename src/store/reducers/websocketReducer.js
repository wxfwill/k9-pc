import {SOCKET_LIST_NEWS_MSG} from '../actionTypes';

const initialzeState = {
  newLIst: []
};

export default function accountReducer(state = initialzeState, action) {
  switch (action.type) {
    case SOCKET_LIST_NEWS_MSG:
      return {
        ...state,
        newLIst: action.newLIst
      };
    default:
      return state;
  }
}
