import { compose, withHandlers } from 'recompose';

export const LOAD_DATA = 'LOAD_DATA';
export const LOAD_SUCCESS = 'LOAD_SUCCESS';
export const LOAD_FAIL = 'LOAD_FAIL';
export const UPDATE_QUERY = 'UPDATE_QUERY';

export const ACTION = {
  LOAD_DATA,
  LOAD_SUCCESS,
  LOAD_FAIL,
  UPDATE_QUERY
};

export const updateQuery = (query = {}) => ({ type: UPDATE_QUERY, query });

export const loadData = (query = {}) => ({ type: LOAD_DATA, query });
export const loadSuccess = (result, total) => ({
  type: LOAD_SUCCESS,
  result,
  total
});

export const loadFail = () => ({ type: LOAD_FAIL });

export default compose(
  withHandlers({
    dispatchData:
      ({ enhanceDispatcher: dispatcher }) =>
      (query = {}) => {
        dispatcher(loadData(query));
      },
    dispatchSuccess:
      ({ enhanceDispatcher: dispatcher }) =>
      (result, total = 0) => {
        dispatcher(loadSuccess(result, total));
      },
    dispatchFail:
      ({ enhanceDispatcher: dispatcher }) =>
      () => {
        dispatcher(loadFail());
      },
    dispatchQuery:
      ({ enhanceDispatcher: dispatcher }) =>
      (query = {}) => {
        dispatcher(updateQuery(query));
      }
  })
);
