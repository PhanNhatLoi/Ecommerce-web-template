import { parseObjToQuery } from '~/views/utilities/helpers';

import apiAction from '../../utils/createAction';
import * as types from './types';

export type RequireParams = {
  fromDate: string;
  toDate: string;
  supplierId?: string; // use for vendor
  userId?: string; // use for eca
  memberId?: string; // use for ecaS
  page?: number;
  size?: number;
};

export type Params = {
  obj: RequireParams;
  startWith?: string;
};

// Use for revenue, booking, vendor, ecaUser, ecaServiceUser
export interface StatisticsResponse {
  booking: number;
  vendor: number;
  revenue: number;
  ecaUser: number;
  ecaServiceUser: number;
  totalOrder: number;
}

// use for revenue, booking
export interface VerticalBarChartDataResponse {
  statisticValue: number;
  date?: string;
}

// -----------------------------
// REVENUE ACTIONS
// -----------------------------
export const getRevenueStatistic = (params: Params) =>
  apiAction('get')(types.GET_REVENUE_STATISTIC, `/services/report/api/v1/vendor/request/cs-revenue${parseObjToQuery(params)}`, {}, true);

export const getRevenueChart = (params: Params) =>
  apiAction('get')(types.GET_REVENUE_CHART, `/services/report/api/v1/vendor/request/revenue/chart${parseObjToQuery(params)}`, {}, true);

export interface RevenueListResponse {
  sumRevenue: number;
  sales: number;
  totalOrder: number;
  revenueDate: string;
  totalPromotion: number;
  fee: number;
}

export const getRevenueList = (params: Params) =>
  apiAction('get')(types.GET_REVENUE_LIST, `/services/report/api/v1/vendor/request/revenue${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// REVENUE ACTIONS
// -----------------------------

// -----------------------------
// SERVICE ACTIONS
// -----------------------------
export const getServiceStatistic = (params: Params) =>
  apiAction('get')(types.GET_SERVICE_STATISTIC, `/services/report/api/v1/vendor/request/cs-booking${parseObjToQuery(params)}`, {}, true);

export const getServiceChart = (params: Params) =>
  apiAction('get')(types.GET_SERVICE_CHART, `/services/report/api/v1/vendor/request/booking/chart${parseObjToQuery(params)}`, {}, true);

export interface ServiceListResponse {
  category: string;
  totalRequest: number;
  totalOrder: number;
  revenue: number;
  totalTechnician: number;
}

export const getServiceList = (params: Params) =>
  apiAction('get')(types.GET_SERVICE_LIST, `/services/report/api/v1/vendor/request/booking${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// SERVICE ACTIONS
// -----------------------------

// -----------------------------
// USER ACTIONS
// -----------------------------
export const getUserStatistic = (params: Params) =>
  apiAction('get')(types.GET_USER_STATISTIC, `/services/report/api/v1/vendor/request/cs-customer${parseObjToQuery(params)}`, {}, true);

export interface SupplierChartResponse {
  buyerName: string;
  statisticValue: number;
}

export const getUserChart = (params: Params) =>
  apiAction('get')(types.GET_USER_CHART, `/services/report/api/v1/vendor/request/customer/chart${parseObjToQuery(params)}`, {}, true);

export interface SupplierListResponse {
  totalBooking: number;
  totalUser: number;
  requestDate: string;
  totalTechnician: number;
}

export const getUserList = (params: Params) =>
  apiAction('get')(types.GET_USER_LIST, `/services/report/api/v1/vendor/request/customer${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// USER ACTIONS
// -----------------------------

// -----------------------------
// GIFT ACTIONS
// -----------------------------
export const getGiftStatistic = (params: Params) =>
  apiAction('get')(types.GET_GIFT_STATISTIC, `/services/report/api/v1/vendor/request/cs-gift${parseObjToQuery(params)}`, {}, true);

export interface GiftChartResponse {
  date: string;
  statisticValue: number;
}

export const getGiftChart = (params: Params) =>
  apiAction('get')(types.GET_GIFT_CHART, `/services/report/api/v1/vendor/request/gift/chart${parseObjToQuery(params)}`, {}, true);

export interface GiftListResponse {
  date: string;
  providerName: string;
  code: string;
  customerName: string;
  giftName: string;
  serial: string;
  giftPrice: number;
}

export const getGiftList = (params: Params) =>
  apiAction('get')(types.GET_GIFT_LIST, `/services/report/api/v1/vendor/request/gift${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// GIFT ACTIONS
// -----------------------------

// -----------------------------
// PROMOTION ACTIONS
// -----------------------------
export const getPromotionStatistic = (params: Params) =>
  apiAction('get')(
    types.GET_PROMOTION_STATISTIC,
    `/services/report/api/v1/vendor/request/cs-promotion${parseObjToQuery(params)}`,
    {},
    true
  );

export interface PromotionChartResponse {
  technicianName: string;
  statisticValue: number;
}

export const getPromotionChart = (params: Params) =>
  apiAction('get')(types.GET_PROMOTION_CHART, `/services/report/api/v1/vendor/request/promotion/chart${parseObjToQuery(params)}`, {}, true);

export interface PromotionListResponse {
  date: string;
  totalUser: number;
  promotionName: string;
  totalGara: number;
  totalApply: number;
  totalDiscount: number;
}

export const getPromotionList = (params: Params) =>
  apiAction('get')(types.GET_PROMOTION_LIST, `/services/report/api/v1/vendor/request/promotion${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// PROMOTION ACTIONS
// -----------------------------
