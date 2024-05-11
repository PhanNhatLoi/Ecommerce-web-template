import React, { useMemo } from 'react';
import { useHtmlClassService } from '../../core/Layout';
import SidebarMenuList from './SidebarMenuList';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'react-use';
import { APP_VERSION } from '~/configs';

export function SidebarMenu({ disableScroll }) {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      layoutConfig: uiService.config,
      asideMenuAttr: uiService.getAttributes('aside_menu'),
      ulClasses: uiService.getClasses('aside_menu_nav', true),
      asideClassesFromConfig: uiService.getClasses('aside_menu', true)
    };
  }, [uiService]);

  return (
    <div
      style={{ height: '100%', paddingBottom: '20px' }}
      id="kt_aside_menu"
      data-menu-vertical="1"
      className={`aside-menu ${layoutProps.asideClassesFromConfig}`}
      {...layoutProps.asideMenuAttr}>
      <SidebarMenuList layoutProps={layoutProps} />

      <div className="text-center opacity-70">
        {t('version')} {APP_VERSION}
      </div>
    </div>
  );
}
