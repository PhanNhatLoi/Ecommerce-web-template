import React, { lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { PROFILE_CHANGE_PASS_PATH, PROFILE_EDIT_INFO_PATH, PROFILE_INFO_PATH, PROFILE_INVOICE_INFO_PATH } from '~/configs/routesConfig';
import * as roleBaseStatus from '~/configs/status/settings/roleBaseStatus';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import { ratingActions } from '~/state/ducks/ratings';
import { useSubheader } from '~/views/presentation/core/Subheader';
import AMessage from '~/views/presentation/ui/message/AMessage';

import { ProfileCard } from './ProfileCard';

const PersonaInformation = lazy(() => import('./PersonaInformation'));
const ChangePassword = lazy(() => import('./ChangePassword'));
const EditInformation = lazy(() => import('./EditInformation'));
const InvoiceInformation = lazy(() => import('./InvoiceInformation'));

function Profile(props) {
  const { t } = useTranslation();
  const suhbeader = useSubheader();
  const location = useLocation();
  suhbeader.setTitle(t('profile'));
  const [rating, setRating] = useState(0);

  useEffect(() => {
    props
      .getUser()
      .then((res) => {
        props
          .getVendorRatings()
          .then((res) => {
            setRating(+res?.content?.rating);
          })
          .catch((err) => {
            AMessage.error(t(err.message));
            console.error('trandev ~ file: PersonaInformation.js ~ line 30 ~ useEffect ~ err', err);
          });
      })
      .catch((err) => {
        AMessage.error(t(err.message));
        console.error('trandev ~ file: index.js ~ line 26 ~ useEffect ~ err', err);
      });
  }, []);

  const renderContent = () => {
    switch (location.pathname) {
      case PROFILE_INFO_PATH:
        return <PersonaInformation rating={rating} />;

      case PROFILE_CHANGE_PASS_PATH:
        if (roleBaseStatus.isVendor()) return <ChangePassword />;

      case PROFILE_EDIT_INFO_PATH:
        if (roleBaseStatus.isVendor()) return <EditInformation />;

      case PROFILE_INVOICE_INFO_PATH:
        if (roleBaseStatus.isVendor()) return <InvoiceInformation />;

      default:
        return;
    }
  };

  return (
    <div className="d-flex flex-row">
      <ProfileCard getAuthUser={props.getAuthUser} />
      <div className="flex-row-fluid ml-lg-8">{renderContent()}</div>
    </div>
  );
}

export default connect(
  (state) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    getUser: authActions.getUser,
    getVendorRatings: ratingActions.getVendorRatings
  }
)(Profile);
