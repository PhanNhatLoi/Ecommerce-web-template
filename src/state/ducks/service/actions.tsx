import apiAction from '~/state/ducks/utils/createAction';
import { parseObjToQuery } from '~/views/utilities/helpers';

import * as types from './types';

// -----------------------------
// SERVICE DATA ACTIONS
// -----------------------------
export const getServiceData = (params: any) =>
  apiAction('get')(types.GET_SERVICE_DATA, `/services/request/api/v1/vendor/questions/services${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// SERVICE DATA ACTIONS
// -----------------------------
