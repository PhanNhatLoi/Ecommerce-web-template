import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// PROMOTION ACTIONS
// -----------------------------
export const getPromotions = (params: any) =>
  apiAction('get')(
    types.GET_INSURANCE_PROMOTIONS,
    `/services/product/api/v1/vendor/promotions/insurance${parseObjToQuery(params)}`,
    {},
    true
  );

export const getPromotionDetail = (id: number | string) =>
  apiAction('get')(types.GET_INSURANCE_PROMOTION_DETAIL, `/services/product/api/v1/vendor/promotion/${id}`, {}, true);

export const createInsuranceDiscount = (body: any) =>
  apiAction('post')(types.CREATE_INSURANCE_DISCOUNT, `/services/product/api/v1/vendor/promotion/insurance/package-discount`, body, true);
export const createInsuranceCoupon = (body: any) =>
  apiAction('post')(types.CREATE_INSURANCE_COUPON, `/services/product/api/v1/vendor/promotion/insurance/coupon`, body, true);

export const updatePromotion = (body: any, id: number) =>
  apiAction('put')(types.UPDATE_INSURANCE_PROMOTION, `/services/product/api/v1/vendor/promotion/${id}`, body, true);

export const deleteInsurancePromotion = (id: number) =>
  apiAction('delete')(types.DELETE_INSURANCE_PROMOTION, `/services/product/api/v1/vendor/promotion/${id}`, {}, true);
