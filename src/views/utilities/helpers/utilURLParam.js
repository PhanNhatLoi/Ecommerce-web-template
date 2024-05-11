import { isNumber, isNil, isString } from 'lodash-es';
import { getString } from './utilObject';
const queryString = require('query-string');

export const generatePagination = (
  pageInfo = {
    page: 0,
    size: 10
  }
) => {
  return {
    page: isNumber(pageInfo.page) ? pageInfo.page : 0,
    size: isNumber(pageInfo.size) ? pageInfo.size : 10
  };
};

export const generateSorterObject = (sorter) => {
  let order = getString(sorter, 'order');
  let columnKey = getString(sorter, 'columnKey');

  let sorterObject = {};
  if (columnKey && order) {
    sorterObject = { sort: `${columnKey},${order === 'descend' ? 'DESC' : 'ASC'}` };
  }
  return sorterObject;
};

export const generateURL = ({ path, params }) => {
  let keys = Object.keys(params).filter((key) => !isNil(params[key]) && !(isString(params[key]) && params[key].trim().length === 0));
  return `${path}?${keys.map((key) => `${key}=${params[key]}`).join('&')}`;
};

export const updateURLParams = (props, params = [{ key: '', value: '' }]) => {
  const { location, history } = props;
  let q = queryString.parse(getString(location, 'search'));
  if (Object.keys(params).length !== 0) {
    Object.keys(params).forEach((item) => {
      q[item] = params[item];
    });
  } else {
    params.forEach((item) => {
      q[item.key] = item.value;
    });
  }
  history.push(
    window.location.pathname +
      `?${Object.keys(q)
        .filter((key) => !(isString(q[key]) && q[key].trim().length === 0))
        .map((key) => `${key}=${q[key]}`)
        .join('&')}`
  );
};
