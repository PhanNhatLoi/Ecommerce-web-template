import jwt_decode from 'jwt-decode';
import React from 'react';
import { JWT } from '~/configs';
import { getCookie } from '~/state/utils/session';

export const RoleValue = {
  VENDOR: 'ROLE_VENDOR',
  EMPLOYER: 'ROLE_VENDOR_EMPLOYER'
};

export type tokenType = {
  auth: string;
  deviceId: string;
  employeeId?: string;
  sub: string;
};

export type pagePermissionsType = {
  id: number;
  name: string;
  path: string;
  status: string;
  access: {
    access: boolean;
    nonAccess: boolean;
    viewOnly: boolean;
  };
};

export const isVendor = () => {
  const token = getCookie(JWT);
  if (!token) return false;
  const decoded: tokenType = jwt_decode(token);
  if (decoded && decoded.auth === RoleValue.EMPLOYER) return false;
  return true;
};

export const actionForPage = (path: string, roleBase: any, params?: any): boolean => {
  if (isVendor()) return true;
  if (!roleBase?.pagePermissions) return false;
  let shortPath = path;
  params &&
    Object.values(params).map((m) => {
      shortPath = shortPath.replace('/' + m, '');
    });

  const acctionPage = roleBase.pagePermissions.find(
    (f: { path: string; action: { access: boolean; nonAccess: boolean; viewOnly: boolean } }) => f.path === shortPath
  );
  return acctionPage?.access?.access;
};
