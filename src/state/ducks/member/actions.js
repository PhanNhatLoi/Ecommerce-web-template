import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// MEMBERS ACTIONS
// -----------------------------
export const getMembers = (params) =>
  apiAction('get')(types.GET_MEMBERS, `/services/profile/api/v1/vendor/members${parseObjToQuery(params)}`, {}, true);
export const getReceivers = (params) =>
  apiAction('get')(types.GET_RECEIVERS, `/services/profile/api/v1/vendor/users/options?userType=${params}`, {}, true);
export const getMemberRequests = (params) =>
  apiAction('get')(types.GET_MEMBER_REQUESTS, `/services/repair/api/v1/vendor/member/details${parseObjToQuery(params)}`, {}, true);

export const getMemberDetail = (id) =>
  apiAction('get')(types.GET_MEMBER_DETAIL, `/services/profile/api/v1/vendor/consumer/${id}`, {}, true);
export const createMember = (body) =>
  apiAction('post')(types.CREATE_MEMBER, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/members`, body, true);
export const updateMember = (id, body) =>
  apiAction('put')(types.UPLOAD_MEMBER, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/members/${id}`, body, true);
export const deleteMember = (memberId) =>
  apiAction('post')(types.DELETE_MEMBER, `/services/profile/api/v1/vendor/members/${memberId}/DELETED`, {}, true);
export const approveMember = (memberId) =>
  apiAction('post')(types.APPROVE_MEMBER, `/services/profile/api/v1/vendor/members/${memberId}/APPROVED`, {}, true);
export const rejectMember = (memberId, body) =>
  apiAction('post')(types.REJECT_MEMBER, `/services/profile/api/v1/vendor/members/${memberId}/REJECTED`, body, true);
export const blockMember = (memberId) =>
  apiAction('post')(types.BLOCK_MEMBER, `/services/profile/api/v1/vendor/members/${memberId}/DEACTIVATED`, {}, true);
// -----------------------------
// MEMBERS ACTIONS
// -----------------------------

// -----------------------------
// MEMBERS STATISTIC ACTIONS
// -----------------------------
export const getMemberStatistic = (params) =>
  apiAction('get')(types.GET_MEMBER_STATISTIC, `/services/profile/api/v1/vendor/member/statistic${parseObjToQuery(params)}`, {}, true);

export const getMemberRequestStatistic = (params) =>
  apiAction('get')(
    types.GET_MEMBER_REQUEST_STATISTIC,
    `/services/repair/api/v1/vendor/member/details/statistics/${params.memberId}`,
    {},
    true
  );

export const getMemberRequestRepairStatistic = (params) =>
  apiAction('get')(
    types.GET_MEMBER_REQUEST_STATISTIC,
    `/services/request/api/v1/vendor/members/requests-repairs/statistic${parseObjToQuery(params)}`,
    {},
    true
  );

export const getMemberRequestRepairList = (params) =>
  apiAction('get')(
    types.GET_MEMBER_REQUEST_LIST,
    `/services/request/api/v1/vendor/members/requests-repairs${parseObjToQuery(params)}`,
    {},
    true
  );
// -----------------------------
// MEMBERS STATISTIC ACTIONS
// -----------------------------

// -----------------------------
// CHAT ROLE ACTIONS
// -----------------------------
export const getChatRoleDetail = (memberUserId) =>
  apiAction('get')(types.GET_CHAT_ROLE_DETAIL, `/services/utility/api/v1/vendor/group-chat-members/detail/${memberUserId}`, {}, true);

export const assignChatRole = (memberUserId, body) =>
  apiAction('put')(types.ASSIGN_CHAT_ROLE, `/services/utility/api/v1/vendor/group-chat-members/permission/${memberUserId}`, body, true);
// -----------------------------
// CHAT ROLE ACTIONS
// -----------------------------
