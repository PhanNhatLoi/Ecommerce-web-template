import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

export const getArInvoice = (params) =>
  apiAction('get')(types.GET_AR_INVOICE, `/services/order/api/v1/vendor/invoices${parseObjToQuery(params)}`, {}, true);

export const getArInvoiceDetail = (id) =>
  apiAction('get')(types.GET_CREATE_AR_INVOICE_DETAIL, `/services/order/api/v1/vendor/invoices/${id}`, {}, true);

export const createArInvoice = (body) =>
  apiAction('post')(types.GET_CREATE_AR_INVOICE, `/services/order/api/v1/vendor/invoice`, body, true);

export const getDeliveryOrder = (params) =>
  apiAction('get')(types.GET_DELIVERY_ORDER, `/services/order/api/v1/vendor/deliveries${parseObjToQuery(params)}`, {}, true);
export interface DeliveryOrderType {
  id: number;
  code?: any;
  orderId?: any;
  gdnNo: string;
  soNo: string;
  status: string;
  media?: any;
  note?: any;
  createdDate: string;
  date?: any;
  deliveryDetails: DeliveryDetail[];
  deliveryFrom: DeliveryFrom;
  deliveryTo: DeliveryTo;
}

export interface DeliveryTo {
  customer: Customer;
  fullAddress: string;
  address: Address2;
  phoneNumberTo: string;
  code: number;
  emailTo: string;
}

export interface Address2 {
  address: string;
  districtId: number;
  provinceId: number;
  wardsId: number;
  countryId: number;
  zipCode?: any;
  stateId?: number;
}

export interface Customer {
  id: number;
  profileId: number;
  phone: string;
  email: string;
  website?: any;
  logo?: any;
  avatar?: any;
  genderType?: any;
  dateOfBirth?: any;
  code: string;
  hashCode: string;
  userId?: any;
  langKey?: any;
  address: Address;
  country: Country;
  numOfXims?: any;
  numOfHelps?: any;
  numOfRequests?: any;
  vehicleInfos: any[];
  status?: any;
  fullName: string;
  participationDate: string;
  otherData?: any;
  contact?: any;
}

export interface Address {
  id: number;
  address: string;
  isDefault: boolean;
  lat?: any;
  lng?: any;
  fullAddress: string;
  userId?: any;
  zipCode?: any;
  fullName: string;
  phone: string;
  province: Province;
  district: Province;
  wards: Province;
  state?: any;
  country: Country;
  countryName: string;
  provinceName: string;
  districtName: string;
  wardsName: string;
  stateName?: any;
  districtId: number;
  provinceId: number;
  wardsId: number;
  countryId: number;
  stateId?: any;
}

export interface Country {
  id: number;
  code: string;
  name: string;
  phone: string;
  nativeName: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface DeliveryFrom {
  company: string;
  addressCompany: string;
  phoneNumberCompany: string;
  deliver: string;
  phoneNumberDeliver: string;
  code: number;
  vehicleFrom: string;
  emailFrom: string;
}

export interface DeliveryDetail {
  id: number;
  tradingProductId: number;
  sku?: any;
  productName: string;
  unit: string;
  unitPrice?: any;
  tradingProductCache?: any;
  orderDetailId?: any;
  orderedQuantity: number;
  deliveriedQuantity: number;
  note: string;
  quantity?: number;
  deliveryDate?: any;
}
