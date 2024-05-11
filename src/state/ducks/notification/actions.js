import { parseObjToQuery } from '~/views/utilities/helpers';

import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// NOTIFICATIONS ACTIONS
// -----------------------------
export const getNotifications = (params) =>
  apiAction('get')(types.GET_NOTIFICATIONS, `/services/notification/api/v1/vendor/histories${parseObjToQuery(params)}`, {}, true);
export const getNotificationDetail = (id) =>
  apiAction('get')(types.GET_NOTIFICATION_DETAIL, `/services/notification/api/v1/vendor/details/${id}`, {}, true);
export const createNotification = (body) =>
  apiAction('post')(types.CREATE_NOTIFICATION, `/services/notification/api/v1/vendor/create`, body, true);
export const updateNotification = (body) =>
  apiAction('put')(types.UPLOAD_NOTIFICATION, `/services/notification/api/v1/vendor/notification-tracking`, body, true);
export const deleteNotification = (id) =>
  apiAction('delete')(types.DELETE_NOTIFICATION, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/notification/${id}`, {}, true);
// -----------------------------
// NOTIFICATIONS ACTIONS
// -----------------------------

// -----------------------------
// NOTIFICATIONS STATISTIC ACTIONS
// -----------------------------
export const getNotificationStatistic = (params) =>
  apiAction('get')(types.GET_NOTIFICATION_STATISTIC, `/services/notification/api/v1/vendor/statistic${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// NOTIFICATIONS STATISTIC ACTIONS
// -----------------------------

// -----------------------------
// GET RECEIVERS ACTIONS
// -----------------------------
export const getAllMechanics = (params) =>
  apiAction('get')(types.GET_ALL_MECHANICS, `/services/profile/api/v1/vendor/members/technicians${parseObjToQuery(params)}`, {}, true);
export const getReceiverProfiles = (body) =>
  apiAction('post')(types.GET_RECEIVER_PROFILES, `/services/profile/api/v1/vendor/notification/profiles`, body, true);
// -----------------------------
// GET RECEIVERS ACTIONS
// -----------------------------
