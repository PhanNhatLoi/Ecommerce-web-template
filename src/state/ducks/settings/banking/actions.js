import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

// -----------------------------
// BANK_ACCOUNT ACTIONS
// -----------------------------
export const getBankAccounts = (params) =>
  apiAction('get')(types.GET_BANK_ACCOUNTS, `/services/payment/api/v1/vendor/bank-accounts${parseObjToQuery(params)}`, {}, true);
export const getGlobalBankList = (params) =>
  apiAction('get')(types.GET_BANK_LIST, `/services/payment/api/v1/vendor/banks${parseObjToQuery(params)}`, {}, true);
export const getBankAccountDetail = (id) =>
  apiAction('get')(types.GET_BANK_ACCOUNT_DETAIL, `/services/payment/api/v1/vendor/bank-accounts/${id}`, {}, true);
export const createBankAccount = (body) =>
  apiAction('post')(types.CREATE_BANK_ACCOUNT, `/services/payment/api/v1/vendor/bank-accounts`, body, true);
export const updateBankAccount = (payload) =>
  apiAction('put')(types.UPLOAD_BANK_ACCOUNT, `/services/payment/api/v1/vendor/bank-accounts/${payload.id}`, payload.body, true);
export const deleteBankAccount = (id) =>
  apiAction('delete')(types.DELETE_BANK_ACCOUNT, `/services/payment/api/v1/vendor/bank-accounts/${id}`, {}, true);
export const activateBankAccount = (id) =>
  apiAction('put')(types.ACTIVATE_BANK_ACCOUNT, `/services/payment/api/v1/admin/bank-accounts/activate/${id}`, {}, true);
export const deactivateBankAccount = (id) =>
  apiAction('put')(types.DEACTIVATE_BANK_ACCOUNT, `/services/payment/api/v1/admin/bank-accounts/deactivate/${id}`, {}, true);
// -----------------------------
// BANK_ACCOUNT ACTIONS
// -----------------------------
