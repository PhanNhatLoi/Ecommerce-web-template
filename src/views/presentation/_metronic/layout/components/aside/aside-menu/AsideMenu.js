import React, { useMemo } from 'react';
import { useHtmlClassService } from '../../../_core/MetronicLayout';
import { SidebarMenuList } from './AsideMenuList';

export function SidebarMenu({ disableScroll }) {
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
    <>
      {/* begin::Menu Container */}
      <div
        id="kt_aside_menu"
        data-menu-vertical="1"
        className={`aside-menu my-4 ${layoutProps.asideClassesFromConfig}`}
        {...layoutProps.asideMenuAttr}>
        <SidebarMenuList layoutProps={layoutProps} />
      </div>
      {/* end::Menu Container */}
    </>
  );
}
