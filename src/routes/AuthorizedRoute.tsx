import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-use';
import { DEFAULT_PATH, LOGIN_PATH } from '~/configs/routesConfig';
import * as roleBaseStatus from '~/configs/status/settings/roleBaseStatus';
import { authSelectors } from '~/state/ducks/authUser';
import { getAuthentication } from '~/state/ducks/authUser/selectors';

import AuthBaseRoute from './AuthBaseRoute';
import boRoutes from './boRoutes';

const keyAccess = {
  NEW: 'new',
  EDIT: 'edit',
  UPDATE: 'update',
  CREATE: 'create'
};

const not_access_permission = {
  vi: 'Bạn sẽ được chuyển hướng đến trang chủ vì không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên để biết thêm thông tin!',
  en: 'You will be redirected to the homepage because you do not have access to this page. Please contact the administrator for more information!'
};

const AuthorizedRoute = ({ isAuthenticated, path, businessTypes, getAuthUser, getRoleBase }) => {
  const [pagePermissions, setPagePermissions] = useState<roleBaseStatus.pagePermissionsType[]>([]);
  const location = useLocation();
  const lang = useSelector((state: any) => state['appData'].locale);
  const permissionMess = not_access_permission[lang];

  useEffect(() => {
    if (getRoleBase?.pagePermissions) setPagePermissions(getRoleBase.pagePermissions);
  }, [getRoleBase]);

  const flattenMenuRecursion = (menu) => {
    let sub: any = [];
    const flattenMenu = menu?.map((item) => {
      if (item.subMenus && item?.subMenus?.length) {
        sub = [...sub, ...item.subMenus];
      }
      return item;
    });
    return flattenMenu.concat(sub?.length ? flattenMenuRecursion(sub) : sub);
  };

  const checkUrl = (pathname?: string) => {
    let check = false;
    const key = Object.keys(keyAccess);
    const pathName = pathname?.toLowerCase();
    key.map((m) => {
      if (pathName?.includes(keyAccess[m])) check = true;
    });
    return check;
  };

  const businessTypeValid = () => {
    const userBusinessTypes = getAuthUser?.businessTypes?.map((item: { id: string }) => item.id);
    return businessTypes === 'none' || !businessTypes || userBusinessTypes?.includes(businessTypes);
  };
  const pathValid = (path: string) => {
    //invalid businessType
    let check = true;
    const isBusinessTypeValid = businessTypeValid();
    if (!isBusinessTypeValid) check = false;
    const accessPage = pagePermissions.find((f) => f.path === path);
    if (accessPage && accessPage.access.nonAccess) check = false;
    if (accessPage && accessPage.access.viewOnly && checkUrl(location.pathname)) check = false;

    !check && showNofity();
    return check;
  };

  const showNofity = () => {
    alert(permissionMess);
  };

  const renderRoute = (path, routes, redirectURL = null) => {
    return <Route path={path} component={() => <AuthBaseRoute routes={routes} redirectURL={redirectURL ? redirectURL : path} />} />;
  };

  return (
    <Switch>
      {isAuthenticated && pathValid(path) && renderRoute(path, boRoutes)}
      <Redirect to={isAuthenticated ? DEFAULT_PATH : LOGIN_PATH} />
    </Switch>
  );
};

export default connect((state: any) => ({
  isAuthenticated: getAuthentication(state),
  getAuthUser: authSelectors.getAuthUser(state),
  getRoleBase: authSelectors.getRoleBase(state)
}))(AuthorizedRoute);
