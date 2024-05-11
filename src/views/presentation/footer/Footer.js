import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TYPOGRAPHY_TYPE } from '~/configs';
import ATypography from '~/views/presentation/ui/text/ATypography';

import { useHtmlClassService } from '../core/Layout';

export function Footer() {
  const { t } = useTranslation();
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      footerClasses: uiService.getClasses('footer', true),
      footerContainerClasses: uiService.getClasses('footer_container', true)
    };
  }, [uiService]);

  return (
    <div className={`footer py-4 d-flex flex-lg-column  ${layoutProps.footerClasses}`} id="kt_footer">
      <div className={`${layoutProps.footerContainerClasses} d-flex flex-column flex-md-row align-items-center justify-content-between`}>
        <div className="text-dark order-2 order-md-1">
          <span className="text-muted font-weight-bold mr-2">
            Copyright &copy; 2022 eCarAid Inc. | Powered by{' '}
            <ATypography variant={TYPOGRAPHY_TYPE.LINK} href="https://www.ecaraid.com" target="_blank">
              eCarAid Inc.
            </ATypography>
          </span>
        </div>
        <div className="nav nav-dark order-1 order-md-2">
          <a href="https://ecaraid.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="nav-link pr-3 pl-0">
            {t('privacy_policy')}
          </a>
          <a href="https://ecaraid.com/terms-of-service/" target="_blank" rel="noopener noreferrer" className="nav-link px-3">
            {t('terms_of_service')}
          </a>
        </div>
      </div>
    </div>
  );
}
