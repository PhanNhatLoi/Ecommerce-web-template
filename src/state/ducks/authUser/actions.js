import * as types from './types';
import apiAction, { defaultAction } from '../utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

export const login = (data) => apiAction()(types.LOGIN, '/api/v1/vendor/authenticate', data);

export const getUser = () => apiAction('get')(types.GET_USER, '/services/profile/api/v1/vendor/profiles', {}, true);

export const getRoleBase = () => apiAction('get')(types.GET_ROLE_BASE, '/services/profile/api/v1/system/page-role', {}, true);

export const checkEmail = (email) => apiAction('get')(types.CHECK_EMAIL, `/api/v1/vendor/register/check/${email}`);

export const initOTP = (email) => apiAction('post')(types.INIT_OTP, `/services/profile/api/v1/vendor/otps/init/${email}`);

export const confirmOTP = (email, body) =>
  apiAction('post')(types.CONFIRM_OTP, `/services/profile/api/v1/vendor/otps/validate/${email}`, body);

export const register = (data) => apiAction('post')(types.REGISTER, '/api/v1/vendor/register', data);

export const initResetPass = (body) => apiAction('post')(types.INIT_RESET_PASS, `/api/v1/vendor/account/reset-password/init`, body);

export const confirmOTPResetPass = (data) =>
  apiAction('post')(types.CONFIRM_OTP_RESET_PASS, '/api/v1/vendor/account/reset-password/validate-otp', data);

export const finishResetPass = (data) => apiAction('post')(types.FINISH_RESET_PASS, '/api/v1/vendor/account/reset-password/finish', data);

export const registerProfile = (data) => apiAction()(types.REGISTER_PROFILE, '/vendor/update', data, true);

export const updateUser = (body) => apiAction('put')(types.UPDATE_USER, '/services/profile/api/v1/vendor/profiles', body, true);

export const changePassword = (body) => apiAction('post')(types.CHANGE_PASSWORD, '/api/v1/vendor/account/change-password', body, true);

export const changeEmail = (body) => apiAction('put')(types.CHANGE_PASSWORD, '/change_email', body, true);

export const logout = () => defaultAction(types.LOGOUT);

export const getVendorType = () => apiAction('get')(types.GET_VENDOR_TYPE, '/api/v1/malu/data-types/VENDOR_TYPE');

export const getNumberOfMember = () => apiAction('get')(types.GET_NUMBER_OF_MEMBER, '/api/v1/malu/data-types/NUMBER_OF_MEMBER');

export const getNotificationList = (params) =>
  apiAction('get')(types.GET_LIST_NOTIFICATION, `/services/notification/api/v1/vendor/list${parseObjToQuery(params)}`, {}, true);

export const getNotificationUnreadQuantity = (params) =>
  apiAction('get')(
    types.GET_NOTIFICATION_UNREAD_QUANTITY,
    `/services/notification/api/v1/vendor/new/messages${parseObjToQuery(params)}`,
    {},
    true
  );

export const readNotification = (body) =>
  apiAction('post')(types.SET_READ_NOTIFICATION, `/services/notification/api/v1/read-notifications`, body, true);

export const setUnreadNotification = () => defaultAction(types.SET_UNREAD_NOTIFICATION);
export const setReadNotification = () => defaultAction(types.SET_READ_NOTIFICATION);
export const setAccessNotification = (access) => defaultAction(types.SET_ACCESS_NOTIFICATION, access);

export const getNewOrderQuantity = (params) =>
  apiAction('get')(types.GET_NEW_ORDER_QUANTITY, `/services/order/api/v1/vendor/order/count/product${parseObjToQuery(params)}`, {}, true);

export const getNewInsuranceOrderQuantity = (params) =>
  apiAction('get')(
    types.GET_NEW_INSURANCE_ORDER_QUANTITY,
    `/services/order/api/v1/vendor/order/count/insurance${parseObjToQuery(params)}`,
    {},
    true
  );
