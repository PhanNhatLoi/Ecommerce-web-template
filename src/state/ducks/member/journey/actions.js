import { parseObjToQuery } from '~/views/utilities/helpers';
import apiAction from '../../utils/createAction';
import * as types from './types';

// -----------------------------
// JOURNEYS ACTIONS
// -----------------------------
export const getJourneys = (params) =>
  apiAction('get')(types.GET_JOURNEYS, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-journeys${parseObjToQuery(params)}`, {}, true);
export const getJourneyDetail = (id) =>
  apiAction('get')(types.GET_JOURNEY_DETAIL, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-journeys/${id}`, {}, true);
export const createJourney = (body) => apiAction('post')(types.CREATE_JOURNEY, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-journeys`, body, true);
export const updateJourney = (id, body) =>
  apiAction('put')(types.UPLOAD_JOURNEY, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-journeys/${id}`, body, true);
export const deleteJourney = (id) =>
  apiAction('delete')(types.DELETE_JOURNEY, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-journeys/${id}`, {}, true);
// -----------------------------
// JOURNEYS ACTIONS
// -----------------------------

// -----------------------------
// JOURNEYS STATISTIC ACTIONS
// -----------------------------
export const getJourneyStatistic = (params) =>
  apiAction('get')(types.GET_JOURNEY_STATISTIC, `https://60ad1ce39e2d6b0017458fd4.mockapi.io/api/v1/member-journeys-statistic${parseObjToQuery(params)}`, {}, true);
// -----------------------------
// JOURNEYS STATISTIC ACTIONS
// -----------------------------