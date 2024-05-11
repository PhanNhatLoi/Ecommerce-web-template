import isomorphicFetch from 'isomorphic-fetch';
import { API_CODE } from '~/configs';
import ServerErrors from '~/configs/ServerErrors';
import { authActions } from '~/state/ducks/authUser';
import store from '../store';
import authHeader from './authHeader';

export const requestHeaders = (withToken) => {
  let header = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
    lang: 'vi'
  };
  if (withToken) {
    header = {
      ...header,
      ...authHeader()
    };
  }
  return header;
};

const fetch = (url, method, body, withToken, ctx) => {
  let options = {
    method: method ? method : 'get',
    headers: requestHeaders(withToken, ctx)
  };

  //Fix for Edge cannot have body in options
  if (method !== 'get') {
    options = {
      ...options,
      body: JSON.stringify(body)
    };
  }
  return isomorphicFetch(url, options).then((res) => {
    let httpStatus = res.status;

    let resHeaders = {};
    try {
      res.headers.forEach((value, name) => {
        resHeaders[name] = value;
      });
    } catch (error) {
      console.error('trandev ~ file: fetch.js ~ line 45 ~ returnisomorphicFetch ~ error', error);
    }

    return new Promise(async (resolve, reject) => {
      if (httpStatus === 204) {
        resolve({
          content: { message: API_CODE.SUCCESS },
          headers: resHeaders
        });
      } else if (httpStatus >= 200 && httpStatus <= 299) {
        try {
          let json = await res.json();
          resolve({ content: json, headers: resHeaders });
        } catch (error) {
          resolve({
            content: { message: API_CODE.SERVER_MAINTENANCE },
            headers: resHeaders
          });
          console.error('trandev ~ file: fetch.js ~ line 60 ~ returnnewPromise ~ error', error);
        }
      } else if (httpStatus === 400) {
        try {
          let json = await res.json();
          reject(ServerErrors.getServerError(json));
        } catch (error) {
          console.error('trandev ~ file: fetch.js ~ line 68 ~ returnnewPromise ~ error', error);
        }
      } else if (httpStatus === 401) {
        try {
          let json = await res.json();
          reject(ServerErrors.getServerError(json));
          store.dispatch(authActions.logout());
        } catch (error) {
          console.error('trandev ~ file: fetch.js ~ line 76 ~ returnnewPromise ~ error', error);
        }
        reject(ServerErrors.getServerError({ message: API_CODE.AUTHENTICATION_INVALID }));
        store.dispatch(authActions.logout());
      } else if (httpStatus === 403) {
        try {
          let json = await res.json();
          reject(ServerErrors.getServerError(json));
          store.dispatch(authActions.logout());
        } catch (error) {
          console.error('trandev ~ file: fetch.js ~ line 86 ~ returnnewPromise ~ error', error);
        }

        reject(ServerErrors.getServerError({ message: API_CODE.FORBIDDEN }));
        store.dispatch(authActions.logout());
      } else if (httpStatus === 404) {
        try {
          reject(ServerErrors.getServerError({ message: API_CODE.NOT_FOUND }));
        } catch (error) {
          console.error('ithoangtan -  ~ file: fetch.js ~ line 99 ~ returnnewPromise ~ error', error);
        }
      } else {
        reject(ServerErrors.getServerError({ message: API_CODE.SERVER_MAINTENANCE }));
      }
    });
  });
};

export default fetch;
