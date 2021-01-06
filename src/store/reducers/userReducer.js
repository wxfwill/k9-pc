import {USER_DUTY_LIST} from '../actionTypes';

const initialzeState = {
  dutyList: []
};

export default function userReducer(state = initialzeState, action) {
  switch (action.type) {
    case USER_DUTY_LIST:
      return {
        ...state,
        dutyList: action.list
      };
    default:
      return state;
  }
}
