import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// SALES ACTIONS
// -----------------------------
export const getSales = (params) =>
  apiAction('get')(types.GET_SALES, `/services/repair/api/v1/vendor/repairs/sales${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// SALES ACTIONS
// -----------------------------
