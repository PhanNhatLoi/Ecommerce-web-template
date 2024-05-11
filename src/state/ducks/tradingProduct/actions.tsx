import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// TRADING PRODUCT ACTIONS
// -----------------------------

export const getTradingProduct = (params) =>
  apiAction('get')(types.GET_TRADING_PRODUCTS, `/services/product/api/v1/vendor/trading-product${parseObjToQuery(params)}`, {}, true);
