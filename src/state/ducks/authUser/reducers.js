import { produce } from 'immer';
import { isEqual } from 'lodash-es';
import { SUCCESS_SUFFIX, FAILED_SUFFIX } from '~/configs';
import { addAuthorizedUser, removeAuthorizedUser } from '~/state/utils/session';
import { getString } from '~/views/utilities/helpers/utilObject';
import * as types from './types';
const initialState = {
  user: {},
  isAuthenticated: false,
  roleBase: {},
  notificationUnreadQuantity: 0,
  newOrderQuantity: 0,
  newInsuranceOrderQuantity: 0,
  accessNotification: false
};

const reducer = produce((draft, { type, payload }) => {
  switch (type) {
    case types.LOGIN + SUCCESS_SUFFIX:
      if (payload) {
        addAuthorizedUser(getString(payload, 'content.id_token'));
        draft.isAuthenticated = true;
      }
      return;
    case types.GET_USER + SUCCESS_SUFFIX:
      if (!isEqual(draft.user, payload.content)) {
        draft.user = payload.content || {};
        draft.isAuthenticated = true;
      }
      return;
    case types.GET_ROLE_BASE + SUCCESS_SUFFIX:
      if (!isEqual(draft.roleBase, payload.content)) {
        draft.roleBase = payload.content || {};
        draft.isAuthenticated = true;
      }
      return;
    case types.UPDATE_USER + SUCCESS_SUFFIX:
      draft.user = { ...draft.user, ...payload };
      return;
    case types.CONFIRM_OTP + SUCCESS_SUFFIX:
      draft.user = { ...draft.user, email: payload.email };
      return;
    case types.GET_NOTIFICATION_UNREAD_QUANTITY + SUCCESS_SUFFIX:
      draft.notificationUnreadQuantity = payload.content.numberOfNotifications;
      return;
    case types.GET_NOTIFICATION_UNREAD_QUANTITY + FAILED_SUFFIX:
      draft.notificationUnreadQuantity = 0;
      return;
    case types.SET_READ_NOTIFICATION:
      if (draft.notificationUnreadQuantity <= 0) draft.notificationUnreadQuantity = 0;
      else draft.notificationUnreadQuantity -= 1;
      return;
    case types.SET_UNREAD_NOTIFICATION:
      draft.notificationUnreadQuantity += 1;
      return;
    case types.SET_ACCESS_NOTIFICATION:
      draft.accessNotification = payload;
      return;
    case types.GET_NEW_ORDER_QUANTITY + SUCCESS_SUFFIX:
      draft.newOrderQuantity = payload.content;
      return;
    case types.GET_NEW_ORDER_QUANTITY + FAILED_SUFFIX:
      draft.newOrderQuantity = 0;
      return;
    case types.GET_NEW_INSURANCE_ORDER_QUANTITY + SUCCESS_SUFFIX:
      draft.newInsuranceOrderQuantity = payload.content;
      return;
    case types.GET_NEW_INSURANCE_ORDER_QUANTITY + FAILED_SUFFIX:
      draft.newInsuranceOrderQuantity = 0;
      return;
    case types.LOGOUT:
      removeAuthorizedUser();
      draft.isAuthenticated = false;
      draft.user = {};
      draft.notificationUnreadQuantity = 0;
      draft.newOrderQuantity = 0;
      draft.newInsuranceOrderQuantity = 0;
      draft.accessNotification = false;
      return;
    default:
      return draft;
  }
}, initialState);

export default reducer;
