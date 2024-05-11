import React from 'react';
import { Trans } from 'react-i18next';
import * as PATH from './routesConfig';

//custom breadcrumbs here
export const Breadcrumbs = {
  changePassPage: [
    { pathname: PATH.PROFILE_PATH, title: <Trans i18nKey="profile" /> },
    { pathname: PATH.PROFILE_CHANGE_PASS_PATH, title: <Trans i18nKey="change_password" /> }
  ],
  personalInformationEditPage: [
    { pathname: PATH.PROFILE_PATH, title: <Trans i18nKey="profile" /> },
    { pathname: PATH.PROFILE_EDIT_INFO_PATH, title: <Trans i18nKey="edit_info" /> },
    { pathname: PATH.PROFILE_INFO_PATH, title: <Trans i18nKey="personal_info" /> }
  ],
  personalInformationPage: [
    { pathname: PATH.PROFILE_PATH, title: <Trans i18nKey="profile" /> },
    { pathname: PATH.PROFILE_INFO_PATH, title: <Trans i18nKey="personal_info" /> }
  ]
};
