import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// REPAIR ACTIONS
// -----------------------------
export const getRepairs = (params) =>
  apiAction('get')(types.GET_REPAIRS, `/services/repair/api/v1/vendor/repairs/technician/list${parseObjToQuery(params)}`, {}, true);

export const getRepairDetail = (repairId) =>
  apiAction('get')(types.GET_REPAIR_DETAIL, `/services/repair/api/v1/vendor/repairs/${repairId}`, {}, true);

export const cancelRepair = (repairId) =>
  apiAction('put')(types.CANCEL_REPAIR, `/services/repair/api/v1/vendor/repairs/cancel/${repairId}`, {}, true);

export const confirmCashPayment = (repairId) =>
  apiAction('put')(types.CONFIRM_CASH_PAYMENT, `/services/repair/api/v1/vendor/repairs/payment-confirm/${repairId}`, {}, true);

export const sendDoneConfirmation = (repairId) =>
  apiAction('put')(types.SEND_DONE_CONFIRMATION, `/services/repair/api/v1/vendor/repairs/waiting-done-confirm/${repairId}`, {}, true);

export const getRepairStatistic = (params) =>
  apiAction('get')(
    types.GET_REPAIR_STATISTIC,
    `/services/repair/api/v1/vendor/repairs/technician/status-statistic${parseObjToQuery(params)}`,
    {},
    true
  );
