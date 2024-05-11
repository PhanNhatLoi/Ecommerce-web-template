import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

export const getVendorRatings = (params) =>
  apiAction('get')(types.GET_VENDOR_RATING, `/services/loyalty/api/v1/vendor/rating${parseObjToQuery(params)}`, {}, true);

export const getMechanicRating = (id, params) =>
  apiAction('get')(types.GET_MECHANIC_RATING, `/services/loyalty/api/v1/vendor/technician/${id}/rating${parseObjToQuery(params)}`, {}, true);
