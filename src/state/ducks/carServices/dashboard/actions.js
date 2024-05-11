import apiAction from '~/state/ducks/utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

import * as types from './types';

// -----------------------------
// MEMBER ACTIONS
// -----------------------------
export const getMemberDistribution = (params) =>
  apiAction('get')(
    types.GET_MEMBER_DISTRIBUTION,
    `/services/report/api/v1/venndor/statistic/member-province${parseObjToQuery(params)}`,
    {},
    true
  );

export const getMemberSummary = (params) =>
  apiAction('get')(
    types.GET_MEMBER_SUMMARY,
    `/services/report/api/v1/venndor/statistic/member-summary${parseObjToQuery(params)}`,
    {},
    true
  );

export const getMemberStatistic = (params) =>
  apiAction('get')(types.GET_MEMBER_STATISTIC, `/services/report/api/v1/venndor/statistic/member${parseObjToQuery(params)}`, {}, true);

export const getHelpStatistic = (params) =>
  apiAction('get')(types.GET_HELP_STATISTIC, `/services/report/api/v1/venndor/statistic/repair${parseObjToQuery(params)}`, {}, true);

// -----------------------------
// REQUEST ACTIONS
// -----------------------------
export const getRequestCategory = (params) =>
  apiAction('get')(
    types.GET_REQUEST_CATEGORY_DISTRIBUTION,
    `/services/report/api/v1/venndor/statistic/cs-request-category${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestCity = (params) =>
  apiAction('get')(
    types.GET_REQUEST_CITY_DISTRIBUTION,
    `/services/report/api/v1/venndor/statistic/cs-request-province${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestSummary = (params) =>
  apiAction('get')(
    types.GET_REQUEST_SUMMARY,
    `/services/report/api/v1/venndor/statistic/cs-request-summary${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestStatistic = (params) =>
  apiAction('get')(types.GET_REQUEST_STATISTIC, `/services/report/api/v1/venndor/statistic/cs-request${parseObjToQuery(params)}`, {}, true);

export const getRequestChart = (params) =>
  apiAction('get')(
    types.GET_REQUEST_CHART,
    `/services/report/api/v1/venndor/statistic/cs-request/dashboard/chart${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestList = (params) =>
  apiAction('get')(
    types.GET_REQUEST_LIST,
    `/services/report/api/v1/venndor/statistic/car-service/dashboard${parseObjToQuery(params)}`,
    {},
    true
  );

// -----------------------------
// REVENUE ACTIONS
// -----------------------------
export const getRevenueStatistic = (params) =>
  apiAction('get')(types.GET_REVENUE_STATISTIC, `/services/report/api/v1/venndor/statistic/cs-revenue${parseObjToQuery(params)}`, {}, true);

export const getRevenueChart = (params) =>
  apiAction('get')(
    types.GET_REVENUE_CHART,
    `/services/report/api/v1/venndor/statistic/cs-revenue/dashboard/chart${parseObjToQuery(params)}`,
    {},
    true
  );

// -----------------------------
// ORDER ACTIONS
// -----------------------------
export const getOrderStatistic = (params) =>
  apiAction('get')(types.GET_ORDER_STATISTIC, `/services/report/api/v1/venndor/statistic/cs-order${parseObjToQuery(params)}`, {}, true);

export const getOrderChart = (params) =>
  apiAction('get')(
    types.GET_ORDER_CHART,
    `/services/report/api/v1/venndor/statistic/cs-order/dashboard/chart${parseObjToQuery(params)}`,
    {},
    true
  );
