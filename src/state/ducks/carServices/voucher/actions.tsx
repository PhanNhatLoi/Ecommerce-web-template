import { mockUrl } from '~/configs';
import apiAction from '~/state/ducks/utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

import * as types from './types';

// -----------------------------
// SERVICE PROMOTION ACTIONS
// -----------------------------
export const getServiceVoucher = (params: any) =>
  apiAction('get')(types.GET_SERVICE_PROMOTION, `/services/gift/api/v1/vendor/vouchers/applied/${parseObjToQuery(params)}`, {}, true);

export const getServiceVoucherDetail = (id: any) =>
  apiAction('get')(types.GET_SERVICE_PROMOTION_DETAIL, `/services/gift/api/v1/vendor/vouchers/applied/${id}`, {}, true);

export const updateServiceVoucher = (id: any, body: any) =>
  apiAction('put')(types.UPDATE_SERVICE_PROMOTION, `/services/request/api/v1/vendor/service-voucher/${id}`, body, true);

export const applyVoucher = (body: any) =>
  apiAction('put')(types.APPLY_SERVICE_PROMOTION, `/services/gift/api/v1/vendor/vouchers/apply`, body, true);

export const deleteServiceVoucher = (id: String) =>
  apiAction('delete')(types.DELETE_SERVICE_PROMOTION, `/services/request/api/v1/vendor/service-voucher/deleted/${id}`, {}, true);
// -----------------------------
// SERVICE PROMOTION ACTIONS
// -----------------------------
