import { produce } from 'immer';
import { withReducer, compose } from 'recompose';
import withDispatchFunction, { LOAD_DATA, LOAD_FAIL, LOAD_SUCCESS } from './dataUtils';

const initState = {
  loading: false,
  data: null
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case LOAD_DATA:
      draft.loading = true;
      return;
    case LOAD_SUCCESS:
      draft.loading = false;
      draft.data = action.result;
      return;
    case LOAD_FAIL:
      draft.loading = false;
      return;
    default:
      return draft;
  }
});

export default compose(withReducer('reducer', 'enhanceDispatcher', reducer, initState), withDispatchFunction);
