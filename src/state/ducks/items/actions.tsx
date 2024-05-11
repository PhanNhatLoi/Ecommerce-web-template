import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

// -----------------------------
// ITEMS ACTIONS
// -----------------------------

export type ParamsType = {
  obj: any;
  startWith?: string;
};
export interface getItemType {
  id: number;
  code: string;
  oldCode: string;
  upcCode: string;
  name: string;
  shortName: string;
  inStockPrice: number;
  keywords: string;
  note: string;
  tags: string;
  description: string;
  details: string;
  specifications: string;
  origin: string;
  guaranteeTime: number;
  supplierId: number;
  minPrice: number;
  unit: Unit;
  productStatus: string;
  approveStatus: string;
  mainMedia: MainMedia[];
  subMedia: MainMedia[];
  categories: Category[];
}

export interface Category {
  id: number | string;
  name: string;
  icon: string;
  index: number;
  default: boolean;
  isDefault?: boolean;
  subCatalogs?: any;
}

export interface MainMedia {
  url: string;
  type: string;
}

export interface Unit {
  id: number;
  name: string;
  shortName: string;
}

export interface getSuppliers {
  id: number;
  code: string;
  countAllGiftCard: number;
  countAllSold: number;
  createdDate: string;
  lastModifiedDate: string;
  icon?: any;
  name: string;
  status: string;
  totalPrice: number;
  vendorUserId: string;
  fullAddress: string;
  phone: string;
  email: string;
}

export interface UserType {
  id: number;
  profileId?: any;
  phone: string;
  email: string;
  website?: any;
  logo: string;
  avatar: string;
  genderType?: any;
  dateOfBirth?: any;
  code: string;
  hashCode: string;
  userId: string;
  langKey?: any;
  address: Address;
  country: Country;
  status: string;
  memberSize: MemberSize;
  technicianSize: MemberSize;
  hostTypes: MemberSize[];
  businessTypes: MemberSize[];
  companyType: MemberSize;
  minPrice?: any;
  maxPrice?: any;
  description: string;
  rating: number;
  fullName: string;
  otherInfo: OtherInfo[];
  organizationMedia: OrganizationMedia[];
}

interface OrganizationMedia {
  url: string;
  type: string;
}

interface OtherInfo {
  type: string;
}

interface MemberSize {
  id: number;
  name: string;
  description?: any;
  role: string;
  type: string;
  status: string;
}

interface Address {
  id: number;
  address: string;
  isDefault?: any;
  lat: number;
  lng: number;
  fullAddress: string;
  userId?: any;
  zipCode?: any;
  fullName?: any;
  phone?: any;
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

interface Country {
  id: number;
  code: string;
  name: string;
  phone: string;
  nativeName: string;
}

interface Province {
  id: number;
  name: string;
}

export interface getItemDetailType {
  id: number;
  code: string;
  oldCode: string;
  upcCode: string;
  name: string;
  shortName: string;
  inStockPrice: number;
  keywords: string;
  note: string;
  tags: string;
  description: string;
  details: string;
  specifications: string;
  origin: string;
  guaranteeTime: number;
  supplierId: number;
  minPrice: number;
  unit: Unit;
  productStatus: string;
  approveStatus: string;
  mainMedia: MainMedia[];
  subMedia: MainMedia[];
  categories: Category[];
  supplierName?: string;
  isGenuine: boolean;
  productOfBrands: any;
}

export const getItems = (params) => {
  return apiAction('get')(types.GET_ITEMS, `/services/product/api/v1/vendor/products${parseObjToQuery(params)}`, {}, true);
};
export const getItemsDetail = (id) => apiAction('get')(types.GET_ITEMS_DETAIL, `/services/product/api/v1/vendor/product/${id}`, {}, true);
export const createItem = (body) => apiAction('post')(types.CREATE_ITEM, `/services/product/api/v1/vendor/product`, body, true);
export const updateItem = (payload) =>
  apiAction('put')(types.UPLOAD_ITEM, `/services/product/api/v1/vendor/product/${payload.id}`, payload.body, true);
export const deleteItem = (id) => apiAction('delete')(types.DELETE_ITEM, `/services/product/api/v1/vendor/product/${id}`, {}, true);
export const getCategories = (params) =>
  apiAction('get')(types.GET_CATEGORIES, `/services/catalog/api/v1/vendor/catalogs/product${parseObjToQuery(params)}`, {}, true);

export const getSuppliers = (params) =>
  apiAction('get')(types.GET_SUPPLIERS, `/services/gift/api/v1/vendor/suppliers${parseObjToQuery(params)}`, {}, true);

export const getCounties = (params) =>
  apiAction('get')(types.GET_SUPPLIERS, `/services/product/api/v1/system/country-origin/list${parseObjToQuery(params)}`, {}, true);

// -----------------------------
// ITEMS ACTIONS
// -----------------------------
