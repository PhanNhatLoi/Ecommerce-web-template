import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

export type ParamsType = {
  obj: any;
  startWith?: string;
};

export const getReturns = (params: ParamsType) =>
  apiAction('get')(types.GET_RETURNS, `/services/order/api/v1/vendor/refunds${parseObjToQuery(params)}`, {}, true);

export const getReturnDetail = (id) => apiAction('get')(types.GET_RETURN_DETAIL, `/services/order/api/v1/vendor/refunds/${id}`, {}, true);

export interface PaymentInfoType {
  paymentGateway: string;
  transactionCode: string;
  note: string;
}

export interface AddressType {
  address: string;
  districtId: number;
  provinceId: number;
  wardsId: number;
  countryId: number;
  zipCode: string;
  fullAddress: string;
}

export interface CustomerInfoType {
  buyerName: string;
  code: number;
  phone: string;
  email: string;
  address: AddressType;
}

export interface OrderInfoType {
  sellerName: string;
}

export interface CreateReturnRequest {
  code: string;
  orderId: number;
  orderInfo: OrderInfoType;
  customerId: number;
  customerInfo: CustomerInfoType;
  paymentId: number;
  paymentInfo: PaymentInfoType;
  received: boolean;
  refundAmount: number;
  orderAmount: number;
  note: string;
}

export const createReturn = (body: CreateReturnRequest) =>
  apiAction('post')(types.CREATE_RETURN, `/services/order/api/v1/vendor/refund`, body, true);

export const editReturn = (body) => apiAction('put')(types.UPDATE_RETURN, `/services/order/api/v1/vendor/refund`, body, true);

export const deleteReturn = (id: string) =>
  apiAction('delete')(types.DELETE_RETURN, `/services/order/api/v1/vendor/refund/${id}`, {}, true);
