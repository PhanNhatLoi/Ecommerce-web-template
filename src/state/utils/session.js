import cookie from 'js-cookie';
import { JWT, LANG } from '~/configs/index';

export const setCookie = (key, value, expireDay = 365) => {
  if (typeof window !== 'undefined') {
    cookie.set(key, value, {
      expires: expireDay,
      path: '/'
    });
  }
};

export const removeCookie = (key) => {
  if (typeof window !== 'undefined') {
    cookie.remove(key);
  }
};

export const removeAuthorizedUser = () => {
  removeCookie(JWT);
};

export const addAuthorizedUser = (token) => {
  setCookie(JWT, token);
};

export const getAuthorizedUser = () => {
  return cookie.get(JWT) || '';
};

export const changeLocale = (langKey) => {
  setCookie(LANG, langKey, 365);
};

export const getCookie = (key, req) => {
  return typeof window !== 'undefined' ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
};

const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie.split(';').find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};
