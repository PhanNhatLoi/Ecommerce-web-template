import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';
import { CustomerDetailResponse } from '../../customer/actions';

// -----------------------------
// TYPE
// -----------------------------

export type DeliveryBodyRequest = {
  orderId?: number;
  gdnNo: string;
  soNo: number;
  deliveryFrom: DeliveryFromResponse;
  deliveryTo: DeliveryToResponse;
  deliveryDetails: DeliveryDetailsResponse[];
  media?: string;
  note?: string;
};

export type DeliveryBodyResponse = {
  id: number;
  code?: string;
  orderId?: number;
  gdnNo: string;
  soNo: string;
  status: string; //RECEIVED | RECEIVED |DELIVERED | IN_PROGRESS | WAITING | DONE
  media?: string;
  note?: string;
  createdDate: Date;
  date?: Date;
  deliveryDetails: DeliveryDetailsResponse[];
  deliveryFrom: DeliveryFromResponse;
  deliveryTo: DeliveryToResponse;
};

export type DeliveryFromResponse = {
  company?: string;
  addressCompany?: string;
  phoneNumberCompany?: string;
  deliver: string;
  phoneNumberDeliver: string;
  code: number;
  vehicleFrom: string;
  emailFrom: string;
};

export type DeliveryToResponse = {
  customer?: CustomerDetailResponse;
  fullAddress: string;
  address: AddressType;
  phoneNumberTo: string;
  code: number;
  emailTo: string;
};

export type AddressType = {
  state: number;
  address: string;
  districtId: number;
  provinceId: number;
  wardsId: number;
  countryId: number;
  zipCode: string;
};

export type DeliveryDetailsResponse = {
  id: number;
  itemCode?: string;
  tradingProductId: number;
  sku?: string;
  productName: string;
  unit?: string;
  unitPrice?: number;
  tradingProductCache?: {};
  orderDetailId?: number;
  orderedQuantity: number;
  deliveriedQuantity: number;
  note?: string;
};

// -----------------------------
// TYPE
// -----------------------------

// -----------------------------
// DELiVERY ACTIONS
// -----------------------------
export const getDeliveryOrders = (params) =>
  apiAction('get')(types.GET_DELIVERY_ORDERS, `/services/order/api/v1/vendor/deliveries${parseObjToQuery(params)}`, {}, true);
// export const getDeliveryOderDetail = (id) =>
//   apiAction('get')(types.GET_DELIVERY_ORDERS_DETAIL, `https://62fa6eb8ffd7197707ec7dd8.mockapi.io/api/e-app/customers/${id}`, {}, true);

export const createDeliveryOrder = (body) =>
  apiAction('post')(types.CREATE_DELIVERY_ORDERS, `/services/order/api/v1/vendor/deliveries`, body, true);

export const updateDeliveryOrder = (body) =>
  apiAction('put')(types.UPDATE_DELIVERY_ORDERS, `/services/order/api/v1/vendor/deliveries`, body, true);

export const deleteDeliveryOrder = (id) =>
  apiAction('delete')(types.DELETE_DELIVERY_ORDERS, `/services/order/api/v1/vendor/deliveries/${id}`, {}, true);
