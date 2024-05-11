import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

export const getSuppliers = (params) =>
  apiAction('get')(types.GET_SUPPLIERS, `/services/gift/api/v1/vendor/suppliers${parseObjToQuery(params)}`, {}, true);

export const getSupplierStatistic = (params) =>
  apiAction('get')(types.GET_SUPPLIER_STATISTICS, `/services/gift/api/v1/vendor/suppliers/statistic${parseObjToQuery(params)}`, {}, true);

export const getDetailSupplier = (id) =>
  apiAction('get')(types.GET_DETAIL_SUPPLIER, `/services/gift/api/v1/vendor/suppliers/${id}`, {}, true);

export const updateSupplier = (body) => apiAction('put')(types.UPDATE_SUPPLIER, `/services/gift/api/v1/vendor/suppliers`, body, true);

export const createSupplier = (body) => apiAction('post')(types.CREATE_SUPPLIER, `/services/gift/api/v1/vendor/suppliers`, body, true);

export const approveTechnician = (id) =>
  apiAction('post')(types.APPROVE_SUPPLIER, `/services/profile/api/v1/vendor/members/${id}/APPROVED`, {}, true);

export const deleteSupplier = (body) => apiAction('DELETE')(types.REMOVE_SUPPLIER, `/services/gift/api/v1/vendor/suppliers`, body, true);

export const activateSupplier = (id) =>
  apiAction('PUT')(types.ACTIVATE_SUPPLIER, `/services/gift/api/v1/vendor/suppliers/activate/${id}`, {}, true);

export const deactivateSupplier = (id) =>
  apiAction('PUT')(types.DEACTIVATE_SUPPLIER, `/services/gift/api/v1/vendor/suppliers/deactivate/${id}`, {}, true);
