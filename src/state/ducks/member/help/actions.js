import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// HELPS ACTIONS
// -----------------------------
export const getHelps = (params) =>
  apiAction('get')(types.GET_HELPS, `/services/repair/api/v1/vendor/helper/list${parseObjToQuery(params)}`, {}, true);
export const getHelpWizard = (helpId) =>
  apiAction('get')(types.GET_HELP_WIZARD, `/services/request/api/v1/vendor/problem-infos/${helpId}`, {}, true);
export const getHelpDetail = (id) =>
  apiAction('get')(types.GET_HELP_DETAIL, `/services/repair/api/v1/vendor/repairs/${id}`, {}, true);
export const createHelp = (body) =>
  apiAction('post')(types.CREATE_HELP, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-helps`, body, true);
export const updateHelp = (id, body) =>
  apiAction('put')(types.UPLOAD_HELP, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-helps/${id}`, body, true);
export const deleteHelp = (id) =>
  apiAction('delete')(types.DELETE_HELP, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-helps/${id}`, {}, true);
// -----------------------------
// HELPS ACTIONS
// -----------------------------

// -----------------------------
// HELPS STATISTIC ACTIONS
// -----------------------------
export const getHelpStatistic = (params) =>
  apiAction('get')(types.GET_HELP_STATISTIC, `/services/repair/api/v1/vendor/helper/repair-statistic${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// HELPS STATISTIC ACTIONS
// -----------------------------
