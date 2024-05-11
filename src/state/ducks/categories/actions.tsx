import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// CATEGORY ACTIONS
// -----------------------------

export const getCategories = (params) =>
  apiAction('get')(types.GET_CATEGORIES, `/services/catalog/api/v1/vendor/catalogs/product`, {}, true) ;
