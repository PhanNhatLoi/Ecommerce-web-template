import { parseObjToQuery } from '~/views/utilities/helpers';

import apiAction from '../../utils/createAction';
import * as types from './types';

export type RequireParams = {
  fromDate: string;
  toDate: string;
  createdDateFrom: string;
  createdDateTo: string;
  keyword?: string; // for product, shipping, customer
  categoryId?: string; // for product, shipping
  deliveryPartner?: string; // for product, shipping
  type?: string;
};

export type Params = {
  obj: RequireParams;
  startWith?: string;
};

// Use for revenue, order, product, shipping, customer
export interface StatisticsResponse {
  totalProduct: number;
  totalShippingFee: number;
  totalCustomer: number;
  totalRevenue: number;
  totalOrder: number;
}

// Use for revenue, order, shipping
export interface VerticalBarChartDataResponse {
  date?: string;
  statisticValue: number;
}

// -----------------------------
// MOCK ACTIONS
// -----------------------------
// delete when api update
export const getMockStatistic = (params: any) =>
  apiAction('get')(types.GET_RETURNS, `https://6323dbe4bb2321cba91feea5.mockapi.io/statistic${parseObjToQuery(params)}`, {}, true);

export const getMockChart = (params: any) =>
  apiAction('get')(types.GET_RETURNS, `https://6323dbe4bb2321cba91feea5.mockapi.io/chart${parseObjToQuery(params)}`, {}, true);

export const getMockTable = (params: any) =>
  apiAction('get')(types.GET_RETURNS, `https://6323dbe4bb2321cba91feea5.mockapi.io/company${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// MOCK ACTIONS
// -----------------------------

// -----------------------------
// REVENUE ACTIONS
// -----------------------------
export const getRevenueStatistic = (params: Params) =>
  apiAction('get')(types.GET_REVENUE_STATISTIC, `/services/report/api/v1/vendor/statistic/st-revenue${parseObjToQuery(params)}`, {}, true);

export const getRevenueChart = (params: Params) =>
  apiAction('get')(types.GET_REVENUE_CHART, `/services/report/api/v1/vendor/statistic/revenue/chart${parseObjToQuery(params)}`, {}, true);
export interface RevenueListResponse {
  id: number;
  sellerId: string;
  orderQuantity: number;
  productQuantity: number;
  createdDate: string;
  subTotal: number;
  tax: number;
  shippingFee: number;
  refundQuantity: number;
  refundTotal: number;
  promotionDiscount: number;
  customerQuantity: number;
  revenue: number;
}

export const getRevenueList = (params: Params) =>
  apiAction('get')(types.GET_REVENUE_LIST, `/services/report/api/v1/vendor/statistic/revenue${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// REVENUE ACTIONS
// -----------------------------

// -----------------------------
// ORDER ACTIONS
// -----------------------------
export const getOrderStatistic = (params: Params) =>
  apiAction('get')(
    types.GET_ORDERS_STATISTIC,
    `/services/report/api/v1/vendor/statistic/order/st-revenue${parseObjToQuery(params)}`,
    {},
    true
  );

export const getOrderChart = (params: Params) =>
  apiAction('get')(
    types.GET_ORDERS_CHART,
    `/services/report/api/v1/vendor/statistic/revenue/order/chart${parseObjToQuery(params)}`,
    {},
    true
  );
export interface OrderListResponse {
  orderId: number;
  sellerId: string;
  createdDate: string;
  code: string;
  buyerId: string;
  buyerName?: any;
  productQuantity: number;
  subTotal: number;
  tax: number;
  shippingFee: number;
  refundQuantity: number;
  refundTotal: number;
  paymentGateway: string;
  promotionDiscount: number;
  revenue: number;
}

export const getOrderList = (params: Params) =>
  apiAction('get')(types.GET_ORDERS_LIST, `/services/report/api/v1/vendor/statistic/revenue/order${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// ORDER ACTIONS
// -----------------------------

// -----------------------------
// PRODUCT ACTIONS
// -----------------------------
export const getProductStatistic = (params: Params) =>
  apiAction('get')(
    types.GET_PRODUCTS_STATISTIC,
    `/services/report/api/v1/vendor/statistic/product/st-revenue${parseObjToQuery(params)}`,
    {},
    true
  );

export interface ProductChartResponse {
  productName?: string;
  statisticValue: number;
}

export const getProductChart = (params: Params) =>
  apiAction('get')(
    types.GET_PRODUCTS_CHART,
    `/services/report/api/v1/vendor/statistic/revenue/product/chart${parseObjToQuery(params)}`,
    {},
    true
  );
export interface ProductListResponse {
  id: number;
  sellerId: string;
  createdDate: string;
  productId: number;
  productName: string;
  productQuantity: number;
  total: number;
  tax: number;
  refundQuantity: number;
  refundAmount: number;
  promotionDiscount: number;
  revenue: number;
  shippingFee: number;
  orderQuantity: number;
  customerQuantity: number;
  deliveryPartner: string;
  categories: any;
}

export const getProductList = (params: Params) =>
  apiAction('get')(types.GET_PRODUCTS_LIST, `/services/report/api/v1/vendor/statistic/revenue/product${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// PRODUCT ACTIONS
// -----------------------------

// -----------------------------
// SHIPPING ACTIONS
// -----------------------------
export const getShippingStatistic = (params: Params) =>
  apiAction('get')(
    types.GET_SHIPPING_STATISTIC,
    `/services/report/api/v1/vendor/statistic/delivery/st-revenue${parseObjToQuery(params)}`,
    {},
    true
  );

export const getShippingChart = (params: Params) =>
  apiAction('get')(
    types.GET_SHIPPING_CHART,
    `/services/report/api/v1/vendor/statistic/revenue/delivery/chart${parseObjToQuery(params)}`,
    {},
    true
  );
export interface ShippingListResponse {
  id: number;
  sellerId: string;
  createdDate: string;
  orderQuantity: number;
  totalShippingFee: number;
  deliveryPartner: string;
  revenue: number;
  productQuantity: number;
  customerQuantity: number;
}

export const getShippingList = (params: Params) =>
  apiAction('get')(
    types.GET_SHIPPING_LIST,
    `/services/report/api/v1/vendor/statistic/revenue/delivery${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// SHIPPING ACTIONS
// -----------------------------

// -----------------------------
// CUSTOMER ACTIONS
// -----------------------------
export const getCustomerStatistic = (params: Params) =>
  apiAction('get')(
    types.GET_CUSTOMERS_STATISTIC,
    `/services/report/api/v1/vendor/statistic/customer/st-revenue${parseObjToQuery(params)}`,
    {},
    true
  );

export interface CustomerChartResponse {
  buyerName?: string;
  statisticValue: number;
}

export const getCustomerChart = (params: Params) =>
  apiAction('get')(
    types.GET_CUSTOMERS_CHART,
    `/services/report/api/v1/vendor/statistic/revenue/customer/chart${parseObjToQuery(params)}`,
    {},
    true
  );

export interface CustomerListResponse {
  id: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  orderQuantity: number;
  productQuantity: number;
  createdDate: string;
  subTotal: number;
  tax: number;
  shippingFee: number;
  refundQuantity: number;
  refundTotal: number;
  promotionDiscount: number;
  customerQuantity: number;
  revenue: number;
}

export const getCustomerList = (params: Params) =>
  apiAction('get')(
    types.GET_CUSTOMERS_LIST,
    `/services/report/api/v1/vendor/statistic/revenue/customer${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// CUSTOMER ACTIONS
// -----------------------------
