import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

export const getTechnicians = (params) =>
  apiAction('get')(types.GET_TECHNICIANS, `/services/profile/api/v1/vendor/technician/list${parseObjToQuery(params)}`, {}, true);

export const getDetailTechnician = (id) =>
  apiAction('get')(types.GET_DETAIL_TECHNICIAN, `/services/profile/api/v1/vendor/technician/${id}`, {}, true);

export const updateTechnician = (body) =>
  apiAction('put')(types.UPDATE_TECHNICIAN, `/services/profile/api/v1/vendor/technician`, body, true);

export const createTechnician = (body) => apiAction('post')(types.CREATE_TECHNICIAN, `/api/v1/vendor/technician`, body, true);

export const approveTechnician = (id) => apiAction('post')(types.APPROVE_TECHNICIAN, `/services/profile/api/v1/vendor/members/${id}/APPROVED`, {}, true);

export const removeTechnician = (id) =>
  apiAction('post')(types.REMOVE_TECHNICIAN, `/services/profile/api/v1/vendor/members/${id}/DELETED`, {}, true);
