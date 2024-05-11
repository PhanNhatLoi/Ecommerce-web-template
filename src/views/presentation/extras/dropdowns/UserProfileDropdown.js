import { get, head } from 'lodash-es';
import objectPath from 'object-path';
import React, { useMemo } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PROFILE_CHANGE_PASS_PATH, PROFILE_INFO_PATH } from '~/configs/routesConfig';
import { authActions } from '~/state/ducks/authUser';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import { useHtmlClassService } from '../../core/Layout';
import { DropdownTopbarItemToggler } from '../../dropdowns';
import AuthAvatar from '../../ui/Images/AuthAvatar';
import * as roleBaseStatus from '~/configs/status/settings/roleBaseStatus';

function UserProfileDropdown({ user, logout }) {
  const { t } = useTranslation();

  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      light: objectPath.get(uiService.config, 'extras.user.dropdown.style') === 'light'
    };
  }, [uiService]);

  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle as={DropdownTopbarItemToggler} id="dropdown-toggle-user-profile">
        <div className={'btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2'}>
          <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">{t('hi')}</span>{' '}
          <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">{user?.fullName}</span>
          {Boolean(user?.avatar) ? (
            <AuthAvatar symbolClassName="symbol symbol-35" isSymbolLabel size={32} isAuth src={firstImage(user?.avatar)} />
          ) : (
            <span className="symbol symbol-35 symbol-light-success">
              <span className="symbol-label font-size-h5 font-weight-bold">{head(user?.fullName)}</span>
            </span>
          )}
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
        <>
          {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
          {layoutProps.light && (
            <>
              <div className="d-flex align-items-center p-8 rounded-top">
                <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                  <img src={toAbsoluteUrl('/media/users/300_21.jpg')} alt="" />
                </div>
                <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">{user?.fullName}</div>
                <span className="label label-light-success label-lg font-weight-bold label-inline">3 messages</span>
              </div>
              <div className="separator separator-solid"></div>
            </>
          )}

          {!layoutProps.light && (
            <div
              className="d-flex align-items-center justify-content-between flex-wrap p-8 bgi-size-cover bgi-no-repeat rounded-top"
              style={{
                backgroundImage: `url(${toAbsoluteUrl('/media/misc/bg-1.jpg')})`
              }}>
              {Boolean(user?.avatar) ? (
                <AuthAvatar isSymbolLabel size={64} isAuth src={firstImage(user?.avatar)} />
              ) : (
                <div className="symbol bg-white-o-15 mr-3">
                  <span className="symbol-label text-success font-weight-bold font-size-h4">
                    {get(user, 'name[0]') || get(user, 'shortName[0]') || get(user, 'email[0]')}
                  </span>
                </div>
              )}
              <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
                {user?.fullName || user?.name || user?.shortName || user?.email}
              </div>
            </div>
          )}
        </>

        <div className="navi navi-spacer-x-0 pt-5">
          <Link to={PROFILE_INFO_PATH} className="navi-item px-8 cursor-pointer">
            <div className="navi-link">
              <div className="navi-icon mr-2">
                <i className="flaticon2-calendar-3 text-success" />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold cursor-pointer">{t('my_profile')}</div>
                <div className="text-muted">{t('my_profile_des')}</div>
              </div>
            </div>
          </Link>
          {roleBaseStatus.isVendor() && (
            <Link to={PROFILE_CHANGE_PASS_PATH} className="navi-item px-8">
              <div className="navi-link">
                <div className="navi-icon mr-2">
                  <i className="flaticon2-shield text-warning"></i>
                </div>
                <div className="navi-text">
                  <div className="font-weight-bold">{t('change_password')}</div>
                  <div className="text-muted">{t('change_your_pass')}</div>
                </div>
              </div>
            </Link>
          )}

          <div className="navi-separator mt-3"></div>

          <div className="navi-footer  px-8 py-5">
            <button onClick={() => logout()} className="btn btn-light-primary font-weight-bold">
              {t('sign_out')}
            </button>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
export default connect((state) => ({ user: state.authUser.user }), { logout: authActions.logout })(UserProfileDropdown);
