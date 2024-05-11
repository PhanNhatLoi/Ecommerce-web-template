import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// ORDER ACTIONS
// -----------------------------
export const getSalesOrders = (params) => {
  params?.FromDate && (params.totalFrom = params.FromDate);
  params?.ToDate && (params.totalTo = params.ToDate);

  return apiAction('get')(types.GET_SALES_ORDERS, `/services/order/api/v1/vendor/orders${parseObjToQuery(params)}`, {}, true);
};

export const getOrderDetail = (id) => apiAction('get')(types.GET_ORDER_DETAIL, `/services/order/api/v1/vendor/orders/${id}`, {}, true);

export const createSaleOrder = (body) =>
  apiAction('post')(types.CREATE_SALE_ORDER, `/services/order/api/v1/vendor/customer/orders`, body, true);

export const updateSaleOrder = (body: any) =>
  apiAction('PUT')(types.UPDATE_SALE_ORDER, `/services/order/api/v1/vendor/customer/orders`, body, true);

export const updateStatusSaleOrder = (body: { id: String; status: String; rejectNote?: String }) => {
  return apiAction('PUT')(
    types.UPDATE_STATUS_SALE_ORDER,
    `/services/order/api/v1/vendor/orders/${body.status.toLocaleLowerCase()}/${body.id}${
      body.rejectNote ? `?note=${body.rejectNote}` : ''
    }`,
    {},
    true
  );
};

export const deleteSaleOrder = (id: String) =>
  apiAction('delete')(types.DELETE_SALE_ORDER, `/services/order/api/v1/vendor/orders/${id}`, {}, true);

// export const getPaymentInfo = (id) =>
//   apiAction('get')(types.GET_PAYMENT_INFO, `/services/payment/api/v1/vendor/payment-repair/${id}`, {}, true);

// export const getOrderStatistic = (params) =>
//   apiAction('get')(types.GET_ORDER_STATISTIC, `/services/repair/api/v1/vendor/orders/status-statistic${parseObjToQuery(params)}`, {}, true);

// export const getConsumerDetail = (id) =>
//   apiAction('get')(types.GET_CONSUMER_DETAIL, `/services/profile/api/v1/vendor/consumer/user/${id}`, {}, true);
