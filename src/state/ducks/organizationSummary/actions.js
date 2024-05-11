import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

export const getSummaryStatistic = (params) =>
  apiAction('get')(
    types.GET_SUMMARY_STATISTICS,
    `/services/report/api/v1/venndor/statistic/os-summary${parseObjToQuery(params)}`,
    {},
    true
  );

export const getRequestStatistic = (params) =>
  apiAction('get')(types.GET_REQUEST_STATISTIC, `/services/report/api/v1/venndor/statistic/os-request${parseObjToQuery(params)}`, {}, true);

export const getMemberStatistic = (params) =>
  apiAction('get')(types.GET_MEMBER_STATISTIC, `/services/report/api/v1/venndor/statistic/os-member${parseObjToQuery(params)}`, {}, true);

export const getSaleStatistic = (params) =>
  apiAction('get')(types.GET_SALE_STATISTIC, `/services/report/api/v1/venndor/statistic/os-sale${parseObjToQuery(params)}`, {}, true);
