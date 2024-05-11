import apiAction from '~/state/ducks/utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

import * as types from './types';

// -----------------------------
// CAR TRADING ACTIONS
// -----------------------------
export const getCarTrading = (params: any) =>
  apiAction('get')(types.GET_CAR_TRADING, `/services/product/api/v1/vendor/car-trading${parseObjToQuery(params)}`, {}, true);

export const getCarTradingStatistic = (params: any) =>
  apiAction('get')(types.GET_CAR_TRADING, `/services/product/api/v1/vendor/car-trading/statistic${parseObjToQuery(params)}`, {}, true);

export const getCarTradingDetail = (id: any) =>
  apiAction('get')(types.GET_CAR_TRADING_DETAIL, `/services/product/api/v1/vendor/car-trading/${id}`, {}, true);

export const createCarTrading = (body: any) =>
  apiAction('post')(types.CREATE_CAR_TRADING, '/services/product/api/v1/vendor/car-trading', body, true);

export const updateCarTrading = (body: any) =>
  apiAction('put')(types.UPDATE_CAR_TRADING, `/services/product/api/v1/vendor/car-trading`, body, true);

export const deleteCarTrading = (id: String) =>
  apiAction('delete')(types.DELETE_CAR_TRADING, `/services/product/api/v1/vendor/car-trading/deleted/${id}`, {}, true);

export const markedSoldTrading = (body: any) =>
  apiAction('post')(types.UPDATE_CAR_TRADING, `/services/product/api/v1/vendor/purchase-transaction`, body, true);

export const updateStatusTrading = (id: number, status: string) =>
  apiAction('put')(types.UPDATE_CAR_TRADING, `/services/product/api/v1/vendor/car-trading/${id}/${status}`, {}, true);
// -----------------------------
// CAR TRADING ACTIONS
// -----------------------------
