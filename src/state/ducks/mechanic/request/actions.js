import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// REQUESTS ACTIONS
// -----------------------------
export const getRequests = (params) =>
  apiAction('get')(types.GET_REQUESTS, `/services/request/api/v1/vendor/problems/nearby${parseObjToQuery(params)}`, {}, true);
export const getRequestDetail = (id) =>
  apiAction('get')(types.GET_REQUEST_DETAIL, `/services/request/api/v1/vendor/request/problems/details/${id}`, {}, true);
export const createRequest = (body) =>
  apiAction('post')(types.CREATE_REQUEST, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/requests`, body, true);
export const updateRequest = (id, body) =>
  apiAction('put')(types.UPLOAD_REQUEST, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/requests/${id}`, body, true);
export const deleteRequest = (id) =>
  apiAction('delete')(types.DELETE_REQUEST, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/requests/${id}`, {}, true);
// -----------------------------
// REQUESTS ACTIONS
// -----------------------------

// -----------------------------
// REQUESTS STATISTIC ACTIONS
// -----------------------------
export const getRequestStatistic = (params) =>
  apiAction('get')(
    types.GET_REQUEST_STATISTIC,
    `/services/request/api/v1/vendor/technician/problems/statistic${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// REQUESTS STATISTIC ACTIONS
// -----------------------------
