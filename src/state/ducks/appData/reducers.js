import * as types from './types';
import { produce } from 'immer';
import { changeLocale } from '~/state/utils/session';
import { SUCCESS_SUFFIX, FAILED_SUFFIX } from '~/configs';

const initialState = {
  initData: null,
  locale: 'vi',
  generalTypes: [],
  country: {},
  countries: [],
  notificationUnreadQuantity: 0,
  accessNotification: false
};

const reducer = produce((draft, { payload, type }) => {
  switch (type) {
    case types.GET_COUNTRY + SUCCESS_SUFFIX:
      draft.country = payload.content;
      return;
    case types.GET_LIST_COUNTRY + SUCCESS_SUFFIX:
      if (payload) {
        draft.countries = payload.content;
      }
      return;
    case types.GET_GENERAL_TYPE + SUCCESS_SUFFIX:
      draft.generalTypes = payload.content;
      return;
    // Not call API
    case types.INIT_APP_DATA:
      draft.initData = 'success';
      return;
    case types.SET_COUNTRYID:
      draft.country = { ...draft.country, ...payload };
      return;
    case types.SET_LANGUAGE:
      draft.locale = payload;
      changeLocale(payload);
      return;
    default:
      return draft;
  }
}, initialState);

export default reducer;
