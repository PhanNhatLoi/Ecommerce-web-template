import apiAction from '~/state/ducks/utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

import * as types from './types';

// -----------------------------
// SERVICE PROMOTION ACTIONS
// -----------------------------
export const getServicePromotion = (params: any) =>
  apiAction('get')(types.GET_SERVICE_PROMOTION, `/services/request/api/v1/vendor/promotions${parseObjToQuery(params)}`, {}, true);

export const getServicePromotionDetail = (id: any) =>
  apiAction('get')(types.GET_SERVICE_PROMOTION_DETAIL, `/services/request/api/v1/vendor/promotions/${id}`, {}, true);

export const createServicePromotions = (body: any) =>
  apiAction('post')(types.CREATE_SERVICE_PROMOTION_NEW, '/services/request/api/v1/vendor/promotions', body, true);

export const updateServicePromotion = (id: any, body: any) =>
  apiAction('put')(types.UPDATE_SERVICE_PROMOTION, `/services/request/api/v1/vendor/promotions/${id}`, body, true);

export const deleteServicePromotion = (id: String) =>
  apiAction('delete')(types.DELETE_SERVICE_PROMOTION, `/services/request/api/v1/vendor/promotions/deleted/${id}`, {}, true);
// -----------------------------
// SERVICE PROMOTION ACTIONS
// -----------------------------
