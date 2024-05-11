import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// MECHANICS ACTIONS
// -----------------------------
export const getMechanics = (params) =>
  apiAction('get')(types.GET_MECHANICS, `/services/profile/api/v1/vendor/technician/list${parseObjToQuery(params)}`, {}, true);
export const getMechanicsList = (params) =>
  apiAction('get')(types.GET_MECHANICS, `/services/profile/api/v1/vendor/technician${parseObjToQuery(params)}`, {}, true);
export const getMechanicStatistic = (params) =>
  apiAction('get')(
    types.GET_MECHANIC_STATISTIC,
    `/services/profile/api/v1/vendor/technician/statistic${parseObjToQuery(params)}`,
    {},
    true
  );
export const getMechanicDetail = (id) =>
  apiAction('get')(types.GET_MECHANIC_DETAIL, `/services/profile/api/v1/vendor/view/technician/profile/${id}`, {}, true);
export const createMechanic = (body) => apiAction('post')(types.CREATE_MECHANIC, `/api/v1/vendor/technician`, body, true);
export const updateMechanic = (body) => apiAction('put')(types.UPDATE_MECHANIC, `/services/profile/api/v1/vendor/technician`, body, true);
export const deleteMechanic = (technicianId) =>
  apiAction('post')(types.DELETE_MECHANIC, `/services/profile/api/v1/vendor/members/${technicianId}/DELETED`, {}, true);
export const approveMechanic = (technicianId) =>
  apiAction('post')(types.APPROVE_MECHANIC, `/services/profile/api/v1/vendor/members/${technicianId}/APPROVED`, {}, true);
export const rejectMechanic = (technicianId) =>
  apiAction('post')(types.REJECT_MECHANIC, `/services/profile/api/v1/vendor/members/${technicianId}/REJECTED`, {}, true);
export const blockMechanic = (technicianId) =>
  apiAction('post')(types.BLOCK_MECHANIC, `/services/profile/api/v1/vendor/members/${technicianId}/DEACTIVATED`, {}, true);
// -----------------------------
// MECHANICS ACTIONS
// -----------------------------

// -----------------------------
// REQUEST MECHANICS ACTIONS
// -----------------------------
export const getRequestMechanic = (params) =>
  apiAction('get')(
    types.GET_REQUEST_MECHANICS,
    `/services/repair/api/v1/vendor/view/technician/requests/${params.technicianId}/${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// REQUEST MECHANICS ACTIONS
// -----------------------------

// -----------------------------
// REPAIR STATISTIC ACTIONS
// -----------------------------
export const getRepairStatistic = (params) =>
  apiAction('get')(
    types.GET_REPAIR_STATISTIC,
    `/services/repair/api/v1/vendor/technician/repair-statistic/${params.techUserId}${parseObjToQuery(params)}`,
    {},
    true
  );

export const getMechanicRepairStatistic = (params) =>
  apiAction('get')(
    types.GET_REPAIR_STATISTIC,
    `/services/repair/api/v1/vendor/repairs/technician/status-statistic${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// REPAIR STATISTIC ACTIONS
// -----------------------------

// -----------------------------
// TOP 10 MECHANICS ACTIONS
// -----------------------------
export const getTopMechanics = (params) =>
  apiAction('get')(types.GET_TOP_MECHANICS, `/services/profile/api/v1/vendor/members/technicians/top${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// TOP 10 MECHANICS ACTIONS
// -----------------------------
