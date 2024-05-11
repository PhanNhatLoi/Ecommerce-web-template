import { parseObjToQuery } from '~/views/utilities/helpers';

import apiAction from '../../utils/createAction';
import * as types from './types';

export const getInsuranceContractStatistic = (params: any) =>
  apiAction('get')(types.GET_CONTRACT_STATISTICS, `/services/report/api/v1/vendor/dashboard/insurance${parseObjToQuery(params)}`, {}, true);

export const getInsuranceContractChart = (params: any) =>
  apiAction('get')(
    types.GET_CONTRACT_CHART,
    `/services/report/api/v1/vendor/dashboard/insurance/chart${parseObjToQuery(params)}`,
    {},
    true
  );

export const getOrderChart = (params: any) =>
  apiAction('get')(types.GET_ORDER_CHART, `/services/order/api/v1/vendor/orders/insurance/statistic${parseObjToQuery(params)}`, {}, true);
