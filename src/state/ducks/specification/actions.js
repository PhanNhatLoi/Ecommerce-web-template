import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// ITEMS ACTIONS
// -----------------------------
export const getSpecification = (params) =>
//   apiAction('get')(types.GET_SALES, `/services/repair/api/v1/vendor/repairs/sales${parseObjToQuery(params)}`, {}, true);
    apiAction('get')(types.GET_SPECIFICATION, `https://6322fee7a624bced3083e4b0.mockapi.io/Specification${parseObjToQuery(params)}`, {}, true);
    export const getSpecificationDetail = (id) =>
    apiAction('get')(types.GET_SPECIFICATION_DETAIL, `https://6322fee7a624bced3083e4b0.mockapi.io/Specification/${id}`, {}, true);
    export const createSpecification = (body) =>
    apiAction('post')(types.CREATE_SPECIFICATION, `https://6322fee7a624bced3083e4b0.mockapi.io/Specification`, body, true);
    export const updateSpecification = (payload) =>
    apiAction('put')(types.UPLOAD_SPECIFICATION, `https://6322fee7a624bced3083e4b0.mockapi.io/Specification/${payload.id}`, payload.body, true);
    export const deleteSpecification = (id) =>
    apiAction('delete')(types.DELETE_SPECIFICATION, `https://6322fee7a624bced3083e4b0.mockapi.io/Specification/${id}`, {}, true);
    // -----------------------------
// ITEMS ACTIONS
// -----------------------------