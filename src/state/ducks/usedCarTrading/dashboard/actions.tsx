import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '~/state/ducks/utils/createAction';
import * as types from './types';

export type ParamsType = {
  obj: any;
  startWith?: string;
};

// -----------------------------
// CHART ACTIONS
// -----------------------------
export const getPostChart = (params: ParamsType) =>
  apiAction('get')(
    types.USED_CAR_TRADING_CHART,
    `/services/report/api/v1/vendor/statistic/posts/chart${parseObjToQuery(params)}`,
    {},
    true
  );

export const getViewChart = (params: ParamsType) =>
  apiAction('get')(types.USED_CAR_TRADING_CHART, `/services/report/api/v1/vendor/statistic/view/chart${parseObjToQuery(params)}`, {}, true);
