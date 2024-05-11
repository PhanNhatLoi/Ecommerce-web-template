import { parseObjToQuery } from '~/views/utilities/helpers';

import apiAction from '../../utils/createAction';
import * as types from './types';
import { mockUrl } from '~/configs';

export const getPackage = (params: any) =>
  apiAction('get')(types.GET_PACKAGE, `/services/product/api/v1/vendor/insurance-packages${parseObjToQuery(params)}`, {}, true);

export const getPackageStatistic = (params: any) =>
  apiAction('get')(types.GET_PACKAGE_STATISTIC, `${mockUrl}/insurance/package/statistic${parseObjToQuery(params)}`, {}, true);

export const getPackageDetail = (id: string) =>
  apiAction('get')(types.GET_PACKAGE_DETAIL, `/services/product/api/v1/vendor/insurance-packages/${id}`, {}, true);

export const createPackage = (body: any) =>
  apiAction('post')(types.CREATE_PACKAGE, `/services/product/api/v1/vendor/insurance-packages`, body, true);

export const updatePackage = (body: any, id: string) =>
  apiAction('put')(types.UPDATE_PACKAGE, `/services/product/api/v1/vendor/insurance-packages/${id}`, body, true);

export const deletePackage = (id: string) =>
  apiAction('delete')(types.DELETE_PACKAGE, `/services/product/api/v1/vendor/insurance-packages/${id}`, {}, true);

export const blockPackage = (id: string) =>
  apiAction('put')(types.BLOCK_PACKAGE, `/services/product/api/v1/vendor/insurance-packages/block/${id}`, {}, true);

export const unBlockPackage = (id: string) =>
  apiAction('put')(types.UNBLOCK_PACKAGE, `/services/product/api/v1/vendor/insurance-packages/unblock/${id}`, {}, true);
