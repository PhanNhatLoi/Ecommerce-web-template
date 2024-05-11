import objectPath from 'object-path';
import React, { useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHtmlClassService } from '../core/Layout';
import UserProfileDropdown from './dropdowns/UserProfileDropdown';

function QuickUserToggler({ user }) {
  const { t } = useTranslation();
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas: objectPath.get(uiService.config, 'extras.user.layout') === 'offcanvas'
    };
  }, [uiService]);

  return (
    <>
      {layoutProps.offcanvas && (
        <OverlayTrigger placement="bottom" overlay={<Tooltip id="quick-user-tooltip">View user</Tooltip>}>
          <div className="topbar-item">
            <div className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2" id="kt_quick_user_toggle">
              <>
                <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">{t('hi')}</span>
                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">{user?.fullName}</span>
                {/* {Boolean(props.user?.avatar) ? (
                  <AuthAvatar isSymbolLabel size={64} isAuth src={firstImage(props.user?.avatar)} />
                ) : (
                  <span className="symbol symbol-35 symbol-light-success">
                    <span className="symbol-label font-size-h5 font-weight-bold">{props.user?.fullname[0]}</span>
                  </span>
                )} */}
              </>
            </div>
          </div>
        </OverlayTrigger>
      )}

      {!layoutProps.offcanvas && <UserProfileDropdown />}
    </>
  );
}

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {}
)(QuickUserToggler);
