import { GOOGLE_MAP_API_KEY } from '~/configs';
import apiAction, { defaultAction } from '../utils/createAction';
import * as types from './types';
import { parseObjToQuery } from '~/views/utilities/helpers';

export const initAppData = () => ({ type: types.INIT_APP_DATA });
export const setLanguage = (lang) => ({ type: types.SET_LANGUAGE, payload: lang });

export const getCountry = () => apiAction('get')(types.GET_COUNTRY, 'https://extreme-ip-lookup.com/json/');
export const getListCountry = (params) =>
  apiAction('get')(types.GET_LIST_COUNTRY, `/services/profile/api/v1/countries/list${parseObjToQuery(params)}`);
export const getListState = (params) => apiAction('get')(types.GET_LIST_STATE, `/services/profile/api/v1/states${parseObjToQuery(params)}`);
export const setCountryID = (id) => defaultAction(types.SET_COUNTRYID, { countryId: id });

export const getProvinces = (params) =>
  apiAction('get')(types.GET_PROVINCES, `/services/profile/api/v1/provinces${parseObjToQuery(params)}`);
export const getProvincesWithoutState = (params) =>
  apiAction('get')(types.GET_PROVINCES, `/services/profile/api/v1/provinces${parseObjToQuery(params)}`);
export const getDistricts = (params) =>
  apiAction('get')(types.GET_DISTRICTS, `/services/profile/api/v1/districts/${params.provinceId}${parseObjToQuery(params)}`);
export const getWards = (params) =>
  apiAction('get')(types.GET_WARDS, `/services/profile/api/v1/wards/${params.districtId}${parseObjToQuery(params)}`);
export const updateFirebaseToken = (body) =>
  apiAction('post')(types.UPDATE_FIREBASE_TOKEN, `/services/notification/api/v1/vendor/firebase/tokens`, body, true);

export const getGeoLocation = (params) =>
  apiAction('get')(
    types.GET_GEO_LOCATION,
    `https://maps.googleapis.com/maps/api/geocode/json?address=${params.address}&key=${GOOGLE_MAP_API_KEY}`
  );

export const getGeneralType = (params) =>
  apiAction('get')(types.GET_GENERAL_TYPE, `/services/profile/api/v1/general/general-types?type=${params.type}`);

export const getCarInfo = (id) =>
  apiAction('get')(types.GET_CAR_INFO, `/services/profile/api/v1/vendor/customer-vendors/vehicle-infos/${id}`, {}, true);
