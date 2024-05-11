import { UploadFile } from 'antd/es';
import { parseObjToQuery } from '~/views/utilities/helpers';

import apiAction from '../utils/createAction';
import * as types from './types';

export type ParamsType = {
  obj: any;
  startWith?: string;
};

export interface CustomerListResponse {
  id: number;
  profileId: number;
  userId: number;
  code: string;
  fullname: string;
  phone: string;
  email: string;
  totalOrder: number;
  status: string; // ACTIVATED, DEACTIVATED
  vendorUserId: string;
  lastModifiedDate: string;
  fullAddress: string;
  createdDate: string;
}

export const getCustomers = (params: ParamsType) =>
  apiAction('get')(types.GET_CUSTOMERS, `/services/profile/api/v1/vendor/customer-vendors${parseObjToQuery(params)}`, {}, true);

export interface CustomerOrderListResponse {
  repairId: number;
  totalPrice: number;
  request: string;
  requesterId: string;
  requesterName: string;
  createdQuotationUserId: string;
  createdQuotationFullname: string;
  createdDate: string;
  lastModifiedDate: string;
  status: string;
  uiStatus: string;
}

export const getCustomerOrders = (params: ParamsType) =>
  apiAction('get')(types.GET_CUSTOMER_ORDERS, `/services/repair/api/v1/vendor/orders${parseObjToQuery(params)}`, {}, true);

export interface CustomerStatisticResponse {
  totalCustomer: number;
  activated: number;
  deactivated: number;
}

export const getCustomerStatistic = (params: ParamsType) =>
  apiAction('get')(
    types.GET_CUSTOMER_STATISTIC,
    `/services/profile/api/v1/vendor/customer-vendors/status-statistic${parseObjToQuery(params)}`,
    {},
    true
  );

export interface AddressContactType {
  address: string;
  districtId: number;
  provinceId: number;
  wardsId: number;
  countryId: number;
  stateId?: number;
  zipCode: string;
}

export interface ContactType {
  fullName: string;
  phone: string;
  code: number;
  address: AddressContactType;
  fullAddress: string;
  technician: string;
  gender: string;
  birthday: string;
  email: string;
}

export interface OtherDataType {
  debtMaximum: number;
  currency: string;
  timeDate: number;
  time: string;
  digitalContract: string;
  contractFiles: UploadFile[];
  otherImages: string[];
  otherDocuments: UploadFile[];
}

export interface AddressType {
  id: number;
  address: string;
  isDefault: boolean;
  lat: number;
  lng: number;
  fullAddress: string;
  userId: any;
  zipCode: string;
  fullName: string;
  phone: string;
  province: ProvinceType;
  district: ProvinceType;
  wards: ProvinceType;
  state: any;
  country: CountryType;
  countryName: string;
  provinceName: string;
  districtName: string;
  wardsName: string;
  stateName: string;
  districtId: number;
  provinceId: number;
  wardsId: number;
  countryId: number;
  stateId: number;
}

export interface CountryType {
  id: number;
  code: string;
  name: string;
  phone: string;
  nativeName: string;
}

export interface ProvinceType {
  id: number;
  name: string;
}

export interface CustomerDetailResponse {
  id: number;
  profileId: number;
  phone: string;
  email: string;
  website: string;
  logo: string;
  avatar: string;
  genderType: any;
  dateOfBirth: any;
  code: string;
  hashCode: string;
  userId: any;
  langKey: any;
  address: AddressType;
  country: CountryType;
  numOfXims: any;
  numOfHelps: any;
  numOfRequests: any;
  vehicleInfos: any[]; // ENHANCE LATER
  status: any;
  fullName: string;
  participationDate: string;
  otherData: OtherDataType;
  contact: ContactType[];
}

export const getCustomerDetail = (id: string) =>
  apiAction('get')(types.GET_CUSTOMER_DETAIL, `/services/profile/api/v1/vendor/customer-vendors/profile/${id}`, {}, true);

export interface ContactRequestType {
  fullName: string;
  technician?: string;
  gender?: string;
  birthday?: string;
  phone: string;
  email?: string;
  code: number;
  address?: AddressContactType;
  fullAddress?: string;
}

interface AddressRequestType {
  id?: number; // require for edit
  address: string;
  districtId: number;
  provinceId: number;
  wardsId: number;
  countryId: number;
  zipCode?: string;
  fullAddress: string;
}
export interface CreateEditCustomerRequest {
  id?: number; // require for edit
  fullname: string;
  logo: string;
  phone: string;
  email: string;
  countryId: number;
  address: AddressRequestType;
  vehicleInfos?: any[]; // ENHANCE LATER
  otherData?: OtherDataType;
  contact?: ContactRequestType[];
}

export const createCustomer = (body: CreateEditCustomerRequest) =>
  apiAction('post')(types.CREATE_CUSTOMER, `/services/profile/api/v1/vendor/customer-vendors`, body, true);

export const editCustomer = (body: CreateEditCustomerRequest) =>
  apiAction('put')(types.UPDATE_CUSTOMER, `/services/profile/api/v1/vendor/customer-vendors`, body, true);

export const activateCustomer = (id: string) =>
  apiAction('put')(types.ACTIVATE_CUSTOMER, `/services/profile/api/v1/vendor/customer-vendors/active/${id}`, {}, true);

export const deactivateCustomer = (id: string) =>
  apiAction('put')(types.DEACTIVATE_CUSTOMER, `/services/profile/api/v1/vendor/customer-vendors/deactive/${id}`, {}, true);

export const deleteCustomer = (id: string) =>
  apiAction('delete')(types.DELETE_CUSTOMER, `/services/profile/api/v1/vendor/customer-vendors/${id}`, {}, true);
