import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';
import { mockUrl } from '~/configs/index';

// -----------------------------
// PAYMENT ACTIONS
// -----------------------------
export const getPayments = (params) =>
  apiAction('get')(types.GET_PAYMENT, `/services/payment/api/v1/vendor/payment-repair${parseObjToQuery(params)}`, {}, true);
export const getPaymentsDetail = (id) =>
  apiAction('get')(types.GET_PAYMENT_DETAIL, `/services/payment/api/v1/vendor/payment-transactions/${id}`, {}, true);
export const approveBankOrderPayment = (id) =>
  apiAction('put')(types.APPROVE_BANK_ORDER_PAYMENT, `/services/gift/api/v1/vendor/orders/payment-confirm/${id}`, {}, true);
export const approveBankRepairPayment = (repairId) =>
  apiAction('put')(types.APPROVE_BANK_REPAIR_PAYMENT, `/services/repair/api/v1/vendor/repairs/payment-confirm/${repairId}`, {}, true);
export const rejectBankRepairPayment = (repairId) =>
  apiAction('put')(types.REJECT_BANK_REPAIR_PAYMENT, `/services/payment/api/v1/vendor/payment-repair/reject/${repairId}`, {}, true);
// -----------------------------
// PAYMENT ACTIONS
// -----------------------------

// -----------------------------
// PAYMENT STATISTIC
// -----------------------------
export const getPaymentsStatistic = (params) =>
  apiAction('get')(
    types.GET_PAYMENT_STATISTIC,
    `/services/payment/api/v1/vendor/payment-repair/statistic${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// PAYMENT STATISTIC
// -----------------------------
