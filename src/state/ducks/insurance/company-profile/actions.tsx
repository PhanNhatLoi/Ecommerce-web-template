import apiAction from '../../utils/createAction';
import * as types from './types';
import { mockUrl } from '~/configs';

export const getCompanyProfileDetail = (id) =>
  apiAction('get')(types.GET_COMPANY_PROFILE_DETAIL, `${mockUrl}/insurance/profile/${id}`, {}, true);

export const createCompanyProfile = (body: any) =>
  apiAction('post')(types.CREATE_COMPANY_PROFILE, `${mockUrl}/insurance/profile`, body, true);

export const updateCompanyProfile = (body: any) =>
  apiAction('put')(types.UPDATE_COMPANY_PROFILE, `${mockUrl}/insurance/profile`, body, true);
