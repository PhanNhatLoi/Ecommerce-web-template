import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// PRICING_PRODUCTS ACTIONS
// -----------------------------
export const getPricingProducts = (params) =>
  apiAction('get')(types.GET_PRICING_PRODUCTS, `/services/repair/api/v1/vendor/pricing-systems/${parseObjToQuery(params)}`, {}, true);
export const getPricingProductDetail = (id) =>
  apiAction('get')(types.GET_PRICING_PRODUCT_DETAIL, `/services/repair/api/v1/vendor/pricing-systems/${id}`, {}, true);
export const createPricingProduct = (body) =>
  apiAction('post')(types.CREATE_PRICING_PRODUCT, `/services/repair/api/v1/vendor/pricing-systems`, body, true);
export const updatePricingProduct = (payload) =>
  apiAction('put')(types.UPLOAD_PRICING_PRODUCT, `/services/repair/api/v1/vendor/pricing-systems/${payload.id}`, payload.body, true);
export const activatePricingProduct = (id) =>
  apiAction('put')(types.ACTIVATE_PRICING_PRODUCT, `/services/repair/api/v1/vendor/pricing-systems/active/${id}`, {}, true);
export const deactivatePricingProduct = (id, body) =>
  apiAction('put')(types.DEACTIVATE_PRICING_PRODUCT, `/services/repair/api/v1/vendor/pricing-systems/deactive/${id}`, {}, true);
export const deletePricingProduct = (id) =>
  apiAction('delete')(types.DELETE_PRICING_PRODUCT, `/services/repair/api/v1/vendor/pricing-systems/${id}`, {}, true);
// -----------------------------
// PRICING_PRODUCTS ACTIONS
// -----------------------------

// -----------------------------
// PRICING_PRODUCTS STATISTIC ACTIONS
// -----------------------------
export const getPricingProductStatistic = (params) =>
  apiAction('get')(
    types.GET_PRICING_PRODUCT_STATISTIC,
    `/services/repair/api/v1/vendor/pricing-systems/status-statistic/${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// PRICING_PRODUCTS STATISTIC ACTIONS
// -----------------------------
