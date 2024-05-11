import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// ITEMS ACTIONS
// -----------------------------

export const getUnits = (params) =>
  apiAction('get')(types.GET_UNITS, `/services/product/api/v1/vendor/units${parseObjToQuery(params)}`, {}, true);
// export const getItemsDetail = (id) =>
// apiAction('get')(types.GET_ITEMS_DETAIL, `/services/product/api/v1/vendor/product/${id}`, {}, true);
export const createUnit = (body) => apiAction('post')(types.CREATE_UNIT, `/services/product/api/v1/vendor/units`, body, true);
export const updateUnit = (payload) => apiAction('put')(types.UPLOAD_UNIT, `/services/product/api/v1/vendor/units`, payload.body, true);
export const deleteUnit = (id) => apiAction('delete')(types.DELETE_UNIT, `/services/product/api/v1/vendor/units/${id}`, {}, true);
// -----------------------------
// ITEMS ACTIONS
// -----------------------------
export interface UnitRespone {
  id: number;
  name: string;
  shortName: string;
  description: string;
  userId: string;
}
