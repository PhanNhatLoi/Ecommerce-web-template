import { produce } from 'immer';
import { withReducer, compose } from 'recompose';
import withDispatchFunction, { LOAD_DATA, LOAD_FAIL, LOAD_SUCCESS, UPDATE_QUERY } from './dataUtils';

const initState = {
  loading: false,
  data: null,
  total: 0,
  query: { page: 0, size: 10, keyword: '' }
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case UPDATE_QUERY:
      draft.query = { ...draft.query, ...action.query };
      return;
    case LOAD_DATA:
      draft.loading = true;
      draft.query = { ...draft.query, ...action.query };
      return;
    case LOAD_SUCCESS:
      draft.loading = false;
      draft.data = action.result;
      draft.total = action.total;
      return;
    case LOAD_FAIL:
      draft.loading = false;
      return;
    default:
      return draft;
  }
});

export default compose(withReducer('reducer', 'enhanceDispatcher', reducer, initState), withDispatchFunction);
