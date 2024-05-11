import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

// -----------------------------
// MEMBER ACTIONS
// -----------------------------
export const getMemberChart = (params) =>
  apiAction('get')(types.GET_MEMBER_CHART, `/services/report/api/v1/vendor/statistic/members/chart${parseObjToQuery(params)}`, {}, true);

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
export const getRequestChart = (params) =>
  apiAction('get')(
    types.GET_REQUEST_CATEGORY_DISTRIBUTION,
    `/services/report/api/v1/vendor/statistic/requests/chart${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestCategory = (params) =>
  apiAction('get')(
    types.GET_REQUEST_CATEGORY_DISTRIBUTION,
    `/services/report/api/v1/venndor/statistic/request-category${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestCity = (params) =>
  apiAction('get')(
    types.GET_REQUEST_CITY_DISTRIBUTION,
    `/services/report/api/v1/venndor/statistic/request-province${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestSummary = (params) =>
  apiAction('get')(
    types.GET_REQUEST_SUMMARY,
    `/services/report/api/v1/venndor/statistic/request-summary${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestStatistic = (params) =>
  apiAction('get')(types.GET_REQUEST_STATISTIC, `/services/report/api/v1/venndor/statistic/request${parseObjToQuery(params)}`, {}, true);
