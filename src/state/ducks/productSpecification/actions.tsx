import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// ITEMS ACTIONS
// -----------------------------
export const getProductSpecification = (params) =>
  //   apiAction('get')(types.GET_SALES, `/services/repair/api/v1/vendor/repairs/sales${parseObjToQuery(params)}`, {}, true);
  apiAction('get')(types.GET_PRODUCT_SPECIFICATION, `/services/product/api/v1/vendor/units${parseObjToQuery(params)}`, {}, true);
export const getProductSpecificationDetail = (id) =>
  apiAction('get')(
    types.GET_PRODUCT_SPECIFICATION_DETAIL,
    `https://6322fee7a624bced3083e4b0.mockapi.io/ProductSpecification/${id}`,
    {},
    true
  );
export const createProductSpecification = (body) =>
  apiAction('post')(types.CREATE_PRODUCT_SPECIFICATION, `/services/product/api/v1/vendor/units`, body, true);
export const updateProductSpecification = (payload) =>
  apiAction('put')(
    types.UPLOAD_PRODUCT_SPECIFICATION,
    `https://6322fee7a624bced3083e4b0.mockapi.io/ProductSpecification/${payload.id}`,
    payload.body,
    true
  );
export const deleteProductSpecification = (id) =>
  apiAction('delete')(types.DELETE_PRODUCT_SPECIFICATION, `/services/product/api/v1/vendor/units${id}`, {}, true);
// -----------------------------
// ITEMS ACTIONS
// -----------------------------
