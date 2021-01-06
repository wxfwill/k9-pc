import {USER_DUTY_LIST} from '../actionTypes';

export function saveDutyList(list) {
  return {
    type: USER_DUTY_LIST,
    list
  };
}
