import objectPath from 'object-path';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose, fromRenderProps, withHandlers, withState } from 'recompose';
import { topMemberTabs } from '~/configs/const';
import { incidentActions } from '~/state/ducks/incident';
import { memberActions } from '~/state/ducks/member';
import { SubheaderConsumer } from '~/views/presentation/core/Subheader';
import { UtilDate } from '~/views/utilities/helpers';
import { generatePagination } from '~/views/utilities/helpers/utilURLParam';
import { withTableReducer } from '../../../enhancers';

export const fetchMembers = (props, sorter, pagination = generatePagination(), filters = {}) => {
  const {
    getMembers,
    dispatchData,
    dispatchFail,
    dispatchSuccess,
    location,
    context: { dates }
  } = props;

  const search = qs.parse(location.search);

  let order = objectPath.get(sorter, 'sortOrder');
  let columnKey = objectPath.get(sorter, 'sortField');
  let sorterObject = {};
  if (columnKey && order) {
    sorterObject = { sort: `${columnKey},${order}` };
  }

  const query = {
    ...sorterObject,
    ...pagination,
    ...filters,
    keyword: search.keyword,
    from: dates.from,
    to: dates.to
  };

  dispatchData(query);
  getMembers(query)
    .then(({ content, headers }) => {
      dispatchSuccess(objectPath.get(content, undefined, []), parseInt(objectPath.get(headers, 'x-total-count', 0)));
    })
    .catch((err) => {
      dispatchFail();
    });
};

export const fetchMembersChart = (props) => {
  const {
    getIncidentNewestChart,
    setDataChart,
    context: { dates }
  } = props;

  const query = {
    fromDate: dates.from,
    toDate: dates.to,
    groupType: 'DAY'
  };

  getIncidentNewestChart(query)
    .then(({ content, headers }) => {
      const data = objectPath.get(content, 'data', [])?.map((trou) => trou.countAllTrouble);
      const labels = objectPath.get(content, 'data', [])?.map((trou) => UtilDate.toDateLocal(trou.date));

      setDataChart({ data, labels });
    })
    .catch((err) => {
      console.error('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err);
    });
};

export default compose(
  withRouter,
  withTableReducer,
  withTranslation(),
  withState('dataChart', 'setDataChart', { data: [], labels: [] }),
  withState('tabActive', 'setTabActive', topMemberTabs.REQUEST),
  fromRenderProps(SubheaderConsumer, (props) => ({ context: props })),
  connect(null, {
    getMembers: memberActions.getMembers,
    getIncidentNewestChart: incidentActions.getIncidentNewestChart
  }),
  withHandlers({
    handleChangeTab: (props) => (tab) => {
      const { setTabActive } = props;
      setTabActive(tab);
    }
  })
);
