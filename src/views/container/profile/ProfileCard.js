/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { head } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { NavLink } from 'react-router-dom';
import { PROFILE_CHANGE_PASS_PATH, PROFILE_INFO_PATH, PROFILE_EDIT_INFO_PATH, PROFILE_INVOICE_INFO_PATH } from '~/configs/routesConfig';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import * as roleBaseStatus from '~/configs/status/settings/roleBaseStatus';

export function ProfileCard(props) {
  const { t } = useTranslation();
  const user = {
    avatar: props.getAuthUser?.avatar,
    fullName: props.getAuthUser?.fullName,
    email: props.getAuthUser?.email,
    phone: formatPhoneWithCountryCode(props.getAuthUser?.phone + '', props.getAuthUser?.country?.code),
    address: props.getAuthUser?.address?.fullAddress
  };

  return (
    <>
      {user && (
        <div className="flex-row-auto offcanvas-mobile w-250px w-xxl-350px" id="kt_profile_aside">
          <div className="card card-custom card-stretch">
            {/* begin::Body */}
            <div className="card-body pt-4">
              {/* begin::User */}
              <div className="d-flex align-items-center">
                <div className="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
                  {Boolean(user?.avatar) ? (
                    <AuthAvatar isSymbolLabel size={32} isAuth src={firstImage(user?.avatar)} />
                  ) : (
                    <span className="symbol symbol-35 symbol-light-success">
                      <span className="symbol-label font-size-h5 font-weight-bold">{head(user?.fullName)}</span>
                    </span>
                  )}
                </div>
              </div>
              {/* end::User */}
              {/* begin::Contact */}
              <div className="py-9">
                <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
                  <span className="font-weight-bold mr-2">Email:</span>
                  <span className="text-muted text-hover-primary">{user.email}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
                  <span className="font-weight-bold mr-2">{t('phone')}:</span>
                  <span className="text-muted">{user.phone}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <span className="font-weight-bold mr-2">
                    {t('address')}: <span className="text-muted">{user?.address}</span>
                  </span>
                </div>
              </div>
              {/* end::Contact */}
              {/* begin::Nav */}
              <div className="navi navi-bold navi-hover navi-active navi-link-rounded">
                <div className="navi-item mb-2">
                  <NavLink to={PROFILE_INFO_PATH} className="navi-link py-4" activeClassName="active">
                    <span className="navi-icon mr-2">
                      <span className="svg-icon">
                        <SVG src={toAbsoluteUrl('/media/svg/icons/General/User.svg')}></SVG>{' '}
                      </span>
                    </span>
                    <span className="navi-text font-size-lg">{t('personal_info')}</span>
                  </NavLink>
                </div>
                {roleBaseStatus.isVendor() && (
                  <div>
                    <div className="navi-item mb-2">
                      <NavLink to={PROFILE_EDIT_INFO_PATH} className="navi-link py-4" activeClassName="active">
                        <span className="navi-icon mr-2">
                          <span className="svg-icon">
                            <SVG src={toAbsoluteUrl('/media/svg/icons/Design/Edit.svg')}></SVG>{' '}
                          </span>
                        </span>
                        <span className="navi-text font-size-lg">{t('edit_info')}</span>
                      </NavLink>
                    </div>

                    <div className="navi-item mb-2">
                      <NavLink to={PROFILE_CHANGE_PASS_PATH} className="navi-link py-4" activeClassName="active">
                        <span className="navi-icon mr-2">
                          <span className="svg-icon">
                            <SVG src={toAbsoluteUrl('/media/svg/icons/Communication/Shield-user.svg')}></SVG>{' '}
                          </span>
                        </span>
                        <span className="navi-text font-size-lg">{t('change_password')}</span>
                      </NavLink>
                    </div>

                    <div className="navi-item mb-2">
                      <NavLink to={PROFILE_INVOICE_INFO_PATH} className="navi-link py-4" activeClassName="active">
                        <span className="navi-icon mr-2">
                          <span className="svg-icon">
                            <SVG src={toAbsoluteUrl('/media/svg/icons/Files/File.svg')}></SVG>{' '}
                          </span>
                        </span>
                        <span className="navi-text font-size-lg">{t('invoice_info')}</span>
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
              {/* end::Nav */}
            </div>
            {/* end::Body */}
          </div>
        </div>
      )}
    </>
  );
}
