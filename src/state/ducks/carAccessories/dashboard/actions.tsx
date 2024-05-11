import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

export type ParamsType = {
  obj: any;
  startWith?: string;
};

// -----------------------------
// STATISTIC ACTIONS
// -----------------------------
export interface StatisticDataType {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalGrossProfit: number;
  soleProducts: number;
  returnProducts: number;
}

export interface StatisticsResponse {
  current: StatisticDataType;
  previous: StatisticDataType;
}

export const getStatistics = (params: ParamsType) =>
  apiAction('get')(types.GET_STATISTICS, `/services/report/api/v1/vendor/dashboard/statistics${parseObjToQuery(params)}`, {}, true);

export const getOrderStatistics = (params: ParamsType) =>
  apiAction('get')(types.GET_ORDER_STATISTICS, `/services/report/api/v1/vendor/dashboard/supplier${parseObjToQuery(params)}`, {}, true);

// -----------------------------
// CHART ACTIONS
// -----------------------------
export interface ChartDataResponse {
  date: string;
  statisticValue: number;
}

// doanh thu
export const getRevenueChart = (params: ParamsType) =>
  apiAction('get')(
    types.GET_TOTAL_SALES_CHART,
    `/services/report/api/v1/vendor/dashboard/revenue-supplier/chart${parseObjToQuery(params)}`,
    {},
    true
  );

// doanh số
export const getTotalSalesChart = (params: ParamsType) =>
  apiAction('get')(
    types.GET_TOTAL_SALES_CHART,
    `/services/report/api/v1/vendor/dashboard/revenue/chart${parseObjToQuery(params)}`,
    {},
    true
  );

export const getNetSalesChart = (params: ParamsType) =>
  apiAction('get')(
    types.GET_NET_SALES_CHART,
    `/services/report/api/v1/vendor/dashboard/net/revenue/chart${parseObjToQuery(params)}`,
    {},
    true
  );

export const getOrdersChart = (params: ParamsType) =>
  apiAction('get')(
    types.GET_ORDERS_CHART,
    `/services/report/api/v1/vendor/dashboard/revenue/order/chart${parseObjToQuery(params)}`,
    {},
    true
  );

export const getAverageOrderValueChart = (params: ParamsType) =>
  apiAction('get')(
    types.GET_AVERAGE_ORDER_VALUE_CHART,
    `/services/report/api/v1/vendor/dashboard/average/order/chart${parseObjToQuery(params)}`,
    {},
    true
  );
