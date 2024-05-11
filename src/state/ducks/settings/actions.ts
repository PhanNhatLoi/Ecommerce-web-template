import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

// SERVICE
export type SettingCategoryResponse = {
  icon: string;
  id: number;
  index: number;
  isDefault: boolean;
  name: string;
  parentCatalogId: number;
  subCatalogs: Array<any>;
  services: Array<any>;
  categoryId: number;
};

export const getCurrentSettings = (params) =>
  apiAction('get')(types.GET_CURRENT_SETTINGS, `/services/profile/api/v1/vendor/user-configs/current${parseObjToQuery(params)}`, {}, true);

export const updateSettings = (body) => apiAction('put')(types.UPDATE_SETTINGS, `/services/profile/api/v1/vendor/user-configs`, body, true);

export const getSettingCategories = (params: { parentId?: number }) =>
  apiAction('get')(types.GET_SETTINGS_CATEGORY, `/services/catalog/api/v1/vendor/catalogs${parseObjToQuery(params)}`, {}, true);

export const getVendorSupportedCategories = () =>
  apiAction('get')(types.GET_VENDOR_SUPPORTED_CATEGORY, `/services/request/api/v1/vendor/supported-services`, {}, true);

export const getCategorySupportedServices = (catalogId: any) =>
  apiAction('get')(
    types.GET_CATEGORY_SUPPORTED_SERVICE,
    `/services/request/api/v1/vendor/supported-questions-services/${catalogId}`,
    {},
    true
  );

export const updateSettingCategory = (body: { catalogIds: number[]; suggestCatalogs: string[] }) =>
  apiAction('put')(types.UPDATE_SETTINGS_CATEGORY, `/services/request/api/v1/vendor/supported-services`, body, true);

export const updateSettingServices = (body: any) =>
  apiAction('put')(types.UPDATE_SETTINGS_SERVICE, `/services/request/api/v1/vendor/supported-questions-services`, body, true);

// VEHICLE
export type SettingVehicleResponse = {
  id: number;
  name: string;
};

export const VEHICLE_TYPES = {
  CAR: 'CAR',
  TRUCK: 'TRUCK',
  BUS: 'BUS'
};
export const getSettingVehicles = (params: { type?: (typeof VEHICLE_TYPES)[keyof typeof VEHICLE_TYPES] }) =>
  apiAction('get')(types.GET_SETTINGS_VEHICLE, `/services/profile/api/v1/vendor/vehicle-brands${parseObjToQuery(params)}`, {}, true);

export const getVendorSupportedVehicles = (params: { type?: (typeof VEHICLE_TYPES)[keyof typeof VEHICLE_TYPES] }) =>
  apiAction('get')(
    types.GET_VENDOR_SUPPORTED_VEHICLE,
    `/services/request/api/v1/vendor/supported-vehicle-brands${parseObjToQuery(params)}`,
    {},
    true
  );

export const updateSettingVehicle = (body: { vehicleBrandIds: number[]; suggestVehicleBrands: string[] }) =>
  apiAction('put')(types.UPDATE_SETTINGS_VEHICLE, `/services/request/api/v1/vendor/supported-vehicle-brands`, body, true);
