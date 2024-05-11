import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

export type UserManagermentResponse = {
  profileId: number;
  employerUserId: string;
  vendorUserId: string;
  phone: string;
  email: string;
  fullName: string;
  avatar: string;
  status: string;
  website?: string;
  logo: string;
  code: string;
  hashCode: string;
  address: string;
  joinDate: Date;
  rolePageName: string;
};

export type UserManagermentRequest = {
  parentVendorId: number;
  username: string;
  password: string;
  profile?: {
    countryId: number;
    fullName: string;
    email: string;
    phone: string;
    logo: string;
    avatar: string;
    address: {
      lat: number;
      lng: number;
      address: string;
      districtId: number;
      provinceId: number;
      wardsId: number;
      countryId: number;
      zipCode: string;
      fullAddress: string;
    };
    rolePageId: number;
  };
};

export type UserManagermentRequestUpdate = {
  id: number;
  countryId: number;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  address: {
    lat: number;
    lng: number;
    address: string;
    districtId: number;
    provinceId: number;
    wardsId: number;
    countryId: number;
    zipCode: string;
    fullAddress: string;
  };
  rolePageId: number;
};

export type UsermanagermentDetailResponse = {
  id: number;
  profileId?: number;
  rolePageId: number;
  phone: string;
  email: string;
  website?: string;
  logo: string;
  avatar: string;
  genderType?: any;
  dateOfBirth?: Date;
  code: string;
  hashCode: string;
  userId: string;
  langKey?: any;
  address: {
    id: number;
    address: string;
    isDefault: boolean;
    lat: number;
    lng: number;
    fullAddress: string;
    userId: string;
    zipCode: string;
    fullName: string;
    phone: string;
    province: basicType;
    district: basicType;
    wards: basicType;
    state?: any;
    country: {
      id: number;
      code: string;
      name: string;
      phone: string;
      nativeName: string;
    };
    countryName: string;
    provinceName: string;
    districtName: string;
    wardsName: string;
    stateName?: any;
    wardsId: number;
    stateId?: number;
    districtId: number;
    provinceId: number;
    countryId: number;
  };
  country?: string;
  status: string;
  memberSize?: number;
  technicianSize?: number;
  hostTypes: [];
  businessTypes: [];
  companyType?: string;
  minPrice?: number;
  maxPrice?: number;
  description?: string;
  rating: number;
  fullName: string;
  otherInfo?: string;
  organizationMedia?: string;
};

type basicType = {
  id: number;
  name: string;
};

// -----------------------------
// ROLE_BASE ACTIONS
// -----------------------------
const mockAPI = 'https://63a515e32a73744b00856329.mockapi.io/api/User';
export const getUserManagerment = (params: any) =>
  apiAction('get')(types.GET_USER_MANAGERMENT_SYSTEM, `/services/profile/api/v1/vendor/employer/list${parseObjToQuery(params)}`, {}, true);

export const createUserManagerment = (body: UserManagermentRequest) =>
  apiAction('post')(types.CREATE_USER_MANAGERMENT_SYSTEM, `/api/v1/vendor/register/vendor-employer`, body, false);

export const getDetailUserManagerment = (id: number) =>
  apiAction('get')(types.GET_USER_MANAGERMENT_SYSTEM_DETAIL, `/services/profile/api/v1/vendor/view/employer/profiles/${id}`, {}, true);

export const updateUserManagerment = (body: UserManagermentRequestUpdate) =>
  apiAction('put')(types.UPDATE_USER_MANAGERMENT_SYSTEM, `/services/profile/api/v1/vendor/employer`, body, true);

export const deleteUserManagerment = (id: number) =>
  apiAction('delete')(types.DELETE_USER_MANAGERMENT_SYSTEM, `/services/profile/api/v1/vendor/employer/${id}`, {}, true);
// -----------------------------
// ROLE_BASE ACTIONS
// -----------------------------
