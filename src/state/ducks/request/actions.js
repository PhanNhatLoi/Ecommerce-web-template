import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// REQUESTS ACTIONS
// -----------------------------
export const getRequests = (params) =>
  apiAction('get')(types.GET_REQUESTS, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/requests${parseObjToQuery(params)}`, {}, true);
export const getRequestDetail = (id) =>
  apiAction('get')(types.GET_REQUEST_DETAIL, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/requests/${id}`, {}, true);
export const createRequest = (body) =>
  apiAction('post')(types.CREATE_REQUEST, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/requests`, body, true);
export const updateRequest = (id, body) =>
  apiAction('put')(types.UPLOAD_REQUEST, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/requests/${id}`, body, true);
export const deleteRequest = (id) =>
  apiAction('delete')(types.DELETE_REQUEST, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/requests/${id}`, {}, true);

export const getRequestRequesters = (params) =>
  apiAction('get')(types.GET_REQUEST_REQUESTERS, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/request-requesters${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// REQUESTS ACTIONS
// -----------------------------
