import { parseObjToQuery } from '~/views/utilities/helpers';

import apiAction from '../../utils/createAction';
import * as types from './types';
import { mockUrl } from '~/configs';

export const getInsuranceOrder = (params: any) =>
  apiAction('get')(types.GET_INSURANCE_ORDER, `/services/order/api/v1/vendor/orders${parseObjToQuery(params)}`, {}, true);

export const getInsuranceOrderStatistic = (params: any) =>
  apiAction('get')(types.GET_INSURANCE_ORDER_STATISTIC, `${mockUrl}/insurance/order/statistic${parseObjToQuery(params)}`, {}, true);

export const getInsuranceOrderDetail = (id) =>
  apiAction('get')(types.GET_INSURANCE_ORDER_DETAIL, `/services/order/api/v1/vendor/orders/${id}`, {}, true);

export const createInsuranceOrder = (body: any) =>
  apiAction('post')(types.CREATE_INSURANCE_ORDER, `${mockUrl}/insurance/order`, body, true);

export const updateInsuranceOrder = (body: any) => apiAction('put')(types.UPDATE_INSURANCE_ORDER, `${mockUrl}/insurance/order`, body, true);

export const deleteInsuranceOrder = (id: string) =>
  apiAction('delete')(types.DELETE_INSURANCE_ORDER, `${mockUrl}/insurance/order/${id}`, {}, true);

export const approveInsuranceOrder = (id: string) =>
  apiAction('put')(types.APPROVE_INSURANCE_ORDER, `${mockUrl}/insurance/order/${id}`, {}, true);

export const rejectInsuranceOrder = (id: string) =>
  apiAction('put')(types.REJECT_INSURANCE_ORDER, `${mockUrl}/insurance/order/${id}`, {}, true);
