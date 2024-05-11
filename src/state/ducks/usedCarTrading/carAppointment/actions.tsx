import apiAction from '~/state/ducks/utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

import * as types from './types';

// -----------------------------
// CAR TRADING APPOINTMENT
// -----------------------------
export const getUsedCarTradingAppointment = (params: any) =>
  apiAction('get')(
    types.GET_CAR_APPOINMENT,
    `/services/product/api/v1/vendor/car-appointment-inspection${parseObjToQuery(params)}`,
    {},
    true
  );

export const UpdateStatusCarAppointment = (id: number, status: any) =>
  apiAction('put')(types.GET_CAR_APPOINMENT, `/services/product/api/v1/vendor/car-inspection-appointment/${id}/${status}`, {}, true);

export const UpdateAppointmentDate = (body) =>
  apiAction('put')(types.GET_CAR_APPOINMENT, `/services/product/api/v1/vendor/car-appointment-inspection`, body, true);

// -----------------------------
// CAR TRADING APPOINTMENT
// -----------------------------
