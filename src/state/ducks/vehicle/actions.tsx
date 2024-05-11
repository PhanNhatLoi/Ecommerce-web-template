import apiAction from '~/state/ducks/utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

import * as types from './types';

// -----------------------------
// VEHICLE DATA ACTIONS
// -----------------------------
export const getVehicleBrand = () =>
  apiAction('get')(types.GET_VEHICLE_DATA, `/services/profile/api/v1/vendor/vehicle-brands?type=CAR`, {}, true);

export const getVehicleModel = (params: any) =>
  apiAction('get')(types.GET_VEHICLE_DATA, `/services/profile/api/v1/vendor/vehicle-model${parseObjToQuery(params)}`, {}, true);

export const getVehicleType = (params: { type: string }) =>
  apiAction('get')(types.GET_VEHICLE_DATA, `/services/profile/api/v1/vendor/vehicle-data${parseObjToQuery(params)}`, {}, true);

// -----------------------------
// VEHICLE DATA ACTIONS
// -----------------------------
