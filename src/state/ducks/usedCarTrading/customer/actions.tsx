import apiAction from '~/state/ducks/utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

import * as types from './types';

// -----------------------------
// CAR TRADING ACTIONS
// -----------------------------
export const getUsedCarTradingCustomer = (params: any) =>
  apiAction('get')(types.GET_CAR_TRADING, `/services/profile/api/v1/vendor/customer-vendors${parseObjToQuery(params)}`, {}, true);

export const getUsedCarTradingDetailCustomer = (id: any) =>
  apiAction('get')(types.GET_CAR_TRADING_DETAIL, `/services/request/api/v1/vendor/car-trading/customer/${id}`, {}, true);

export const createUsedCarTradingCustomer = (body: any) =>
  apiAction('post')(types.CREATE_CAR_TRADING, '/services/request/api/v1/vendor/car-trading/customer', body, true);

export const updateUsedCarTradingCustomer = (id: any, body: any) =>
  apiAction('put')(types.UPDATE_CAR_TRADING, `/services/request/api/v1/vendor/car-trading/customer/${id}`, body, true);

export const deleteUsedCarTradingCustomer = (id: String) =>
  apiAction('delete')(types.DELETE_CAR_TRADING, `/services/request/api/v1/vendor/car-trading/customer/deleted/${id}`, {}, true);

export const getListCarTradingBuyByCustomer = (params: any, id: number) =>
  apiAction('get')(types.GET_CAR_TRADING, `/services/product/api/v1/vendor/purchase-transaction/${id}${parseObjToQuery(params)}`, {}, true);

// -----------------------------
// CAR TRADING ACTIONS
// -----------------------------
