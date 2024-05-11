import { parseObjToQuery } from '~/views/utilities/helpers';

import apiAction from '../../utils/createAction';
import * as types from './types';
import { mockUrl } from '~/configs';

export const getInsuranceProfile = (params: any) =>
  apiAction('get')(types.GET_INSURANCE_PROFILE, `/services/order/api/v1/vendor/insurance-contracts${parseObjToQuery(params)}`, {}, true);

export const getInsuranceProfileStatistic = (params: any) =>
  apiAction('get')(types.GET_INSURANCE_PROFILE_STATISTIC, `${mockUrl}/insurance/profile/statistic${parseObjToQuery(params)}`, {}, true);

export const getInsuranceProfileDetail = (id) =>
  apiAction('get')(types.GET_INSURANCE_PROFILE_DETAIL, `/services/order/api/v1/vendor/insurance-contracts/${id}`, {}, true);

export const createInsuranceProfile = (body: any) =>
  apiAction('post')(types.CREATE_INSURANCE_PROFILE, `${mockUrl}/insurance/profile`, body, true);

export const updateInsuranceProfile = (body: any) =>
  apiAction('put')(types.UPDATE_INSURANCE_PROFILE, `${mockUrl}/insurance/profile`, body, true);

export const deleteInsuranceProfile = (id: string) =>
  apiAction('delete')(types.DELETE_INSURANCE_PROFILE, `${mockUrl}/insurance/profile/${id}`, {}, true);

export const approveInsuranceProfile = (id: string) =>
  apiAction('put')(types.APPROVE_INSURANCE_PROFILE, `${mockUrl}/insurance/profile/${id}`, {}, true);

export const rejectInsuranceProfile = (id: string) =>
  apiAction('put')(types.REJECT_INSURANCE_PROFILE, `${mockUrl}/insurance/profile/${id}`, {}, true);

export const getVehicleType = (id) =>
  apiAction('get')(types.GET_VEHICLE_TYPE, `/services/utility/api/v1/vendor/insurance-fees/${id}`, {}, true);
