import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

// -----------------------------
// ROLE_BASE ACTIONS
// -----------------------------

export const getRoleBaseAccessControls = (params: any) =>
  apiAction('get')(types.GET_ROLE_BASE_ACCESS_CONTROLS, `/services/profile/api/v1/vendor/page-roles${parseObjToQuery(params)}`, {}, true);

export const createRoleBaseAccessControl = (body: any) =>
  apiAction('post')(types.CREATE_ROLE_BASE_ACCESS_CONTROL, `/services/profile/api/v1/vendor/page-role`, body, true);

export const getDetailRoleBaseAccessControl = (id: number) =>
  apiAction('get')(types.CREATE_ROLE_BASE_ACCESS_CONTROL, `/services/profile/api/v1/vendor/page-roles/${id}`, {}, true);

export const updateRoleBaseAccessControl = (body: any, id: number) =>
  apiAction('put')(types.CREATE_ROLE_BASE_ACCESS_CONTROL, `/services/profile/api/v1/vendor/page-roles/${id}`, body, true);

export const deleteRoleBaseAccessControl = (id: number) =>
  apiAction('delete')(types.CREATE_ROLE_BASE_ACCESS_CONTROL, `/services/profile/api/v1/vendor/page-roles/${id}`, {}, true);
// -----------------------------
// ROLE_BASE ACTIONS
// -----------------------------
