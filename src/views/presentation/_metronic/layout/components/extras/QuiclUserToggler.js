import React, { useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import objectPath from 'object-path';
import UserProfileDropdown from './dropdowns/UserProfileDropdown';
import { useHtmlClassService } from '~/views/presentation/_metronic/layout/_core/MetronicLayout';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { firstImage } from '~/views/utilities/helpers/utilObject';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';

export function QuickUserToggler() {
  const { t } = useTranslation();
  const user = useSelector((state) => state?.authUser?.user);
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
                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
                  {user?.name || user?.shortName || user?.email || t('manager')}
                </span>
                {Boolean(user?.avatar) ? (
                  <AuthAvatar isSymbolLabel size={32} isAuth src={firstImage(user?.avatar)} />
                ) : (
                  <span className="symbol symbol-35 symbol-light-success">
                    <span className="symbol-label font-size-h5 font-weight-bold">{user?.fullname[0]}</span>
                  </span>
                )}
              </>
            </div>
          </div>
        </OverlayTrigger>
      )}

      {!layoutProps.offcanvas && <UserProfileDropdown />}
    </>
  );
}
