import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// QUOTATION ACTIONS
// -----------------------------
export const getQuotations = (params) =>
  apiAction('get')(types.GET_QUOTATIONS, `/services/repair/api/v1/vendor/quotations${parseObjToQuery(params)}`, {}, true);
export const getQuotationDetail = (id) =>
  apiAction('get')(types.GET_QUOTATION_DETAIL, `/services/repair/api/v1/vendor/quotations/${id}`, {}, true);
export const createQuotation = (body) =>
  apiAction('post')(types.CREATE_QUOTATION, `/services/repair/api/v1/vendor/repair`, body, true);
export const updateQuotation = (body) =>
  apiAction('put')(types.UPLOAD_QUOTATION, `/services/repair/api/v1/vendor/repairs`, body, true);
export const deleteQuotation = (id) =>
  apiAction('delete')(types.DELETE_QUOTATION, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/mechanic-quotations/${id}`, {}, true);
export const cancelQuotation = (id) =>
  apiAction('put')(types.CANCEL_QUOTATION, `/services/repair/api/v1/vendor/repairs/cancel/${id}`, {}, true);
export const getPricingSystems = (params) =>
  apiAction('get')(types.GET_PRICING_SYSTEMS, `/services/repair/api/v1/vendor/pricing-systems${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// QUOTATION ACTIONS
// -----------------------------

// -----------------------------
// QUOTATION STATISTIC ACTIONS
// -----------------------------
export const getQuotationStatistic = (params) =>
  apiAction('get')(
    types.GET_QUOTATION_STATISTIC,
    `/services/repair/api/v1/vendor/quotations/status-statistic${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// QUOTATION STATISTIC ACTIONS
// -----------------------------
