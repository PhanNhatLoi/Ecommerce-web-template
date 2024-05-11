import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../utils/createAction';
import * as types from './types';

export const getIncidentNewestChart = (params) =>
  apiAction('get')(types.GET_PROPLEM_NEWEST_CHART, `/api/v1/malu/statistic/new-trouble${parseObjToQuery(params)}`, {}, true);

export const getIncidents = (params) =>
  apiAction('get')(types.GET_PROPLEMS, `/api/v1/malu/admin/troubles${parseObjToQuery(params)}`, {}, true);
