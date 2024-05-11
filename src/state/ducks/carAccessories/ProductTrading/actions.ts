import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// ORDER ACTIONS
// -----------------------------
export const getTradingProductList = (params: any) => {
  return apiAction('get')(
    types.GET_TRADING_PRODUCT_LIST,
    `/services/product/api/v1/vendor/trading-product${parseObjToQuery(params)}`,
    {},
    true
  );
};
// CHƯA CÓ API
export const getTradingProductDetail = (id: String) =>
  apiAction('get')(types.GET_TRADING_PRODUCT_LIST_DETAIL, `/services/product/api/v1/vendor/trading-product/${id}`, {}, true);

export const createTradingProduct = (body: any) =>
  apiAction('post')(types.CREATE_TRADING_PRODUCT_LIST, `/services/product/api/v1/vendor/trading-product`, body, true);

export const updateTradingProduct = (body: any) =>
  apiAction('PUT')(types.UPDATE_TRADING_PRODUCT_LIST, `/services/product/api/v1/vendor/trading-product`, body, true);

export const deleteTradingProductList = (id) =>
  apiAction('delete')(types.DELETE_TRADING_PRODUCT_LIST, `/services/product/api/v1/vendor/trading-product/${id}`, {}, true);

export const postForSaleTradingProduct = (id: string) =>
  apiAction('put')(types.POST_FOR_SALE_TRADING_PRODUCT, `/services/product/api/v1/vendor/trading-product/activate/${id}`, {}, true);

export const stopSellingTradingProduct = (id: string) =>
  apiAction('put')(types.STOP_SELLING_TRADING_PRODUCT, `/services/product/api/v1/vendor/trading-product/deactivate/${id}`, {}, true);

export const getProductList = (params: any) =>
  apiAction('get')(types.GET_PRODUCT_LIST, `/services/product/api/v1/vendor/products${parseObjToQuery(params)}`, {}, true);

export const getCategoryList = () =>
  apiAction('get')(types.GET_CATEGORY_LIST, '/services/catalog/api/v1/vendor/catalogs/product', {}, true);

export const getPromotionList = () => apiAction('get')(types.GET_PROMOTION_LIST, '/services/product/api/v1/vendor/promotions', {}, true);

export const getUnitList = () => apiAction('get')(types.GET_UNIT_LIST, '/services/product/api/v1/vendor/units', {}, true);

// chưa có api get supplier by id
export const getSupplierDetail = (id: String) =>
  apiAction('get')(types.GET_SUPPLIER_DETAIL, '/services/product/api/v1/vendor/units', {}, true);
