import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// ORDER ACTIONS
// -----------------------------
export const getOrders = (params) =>
  apiAction('get')(types.GET_ORDERS, `/services/repair/api/v1/vendor/orders${parseObjToQuery(params)}`, {}, true);
export const getPaymentInfo = (id) =>
  apiAction('get')(types.GET_PAYMENT_INFO, `/services/payment/api/v1/vendor/payment-repair/${id}`, {}, true);

export const getOrderDetail = (id) => apiAction('get')(types.GET_ORDER_DETAIL, `/services/repair/api/v1/vendor/orders/${id}`, {}, true);

export const getOrderStatistic = (params) =>
  apiAction('get')(
    types.GET_ORDER_STATISTIC,
    `/services/repair/api/v1/vendor/orders/status-statistic${parseObjToQuery(params)}`,
    {},
    true
  );

export const getConsumerDetail = (id) => apiAction('get')(types.GET_CONSUMER_DETAIL, `/services/profile/api/v1/vendor/consumer/user/${id}`, {}, true);
