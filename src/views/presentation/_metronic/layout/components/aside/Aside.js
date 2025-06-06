import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import objectPath from 'object-path';
import { SidebarMenu } from './aside-menu/AsideMenu';
import { useHtmlClassService } from '~/views/presentation/_metronic/layout/_core/MetronicLayout';
import { Brand } from '../brand/Brand';

export default function Sidebar() {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      disableScroll: objectPath.get(uiService.config, 'aside.menu.dropdown') === 'true' || false,
      asideClassesFromConfig: uiService.getClasses('aside', true),
      disableAsideSelfDisplay: objectPath.get(uiService.config, 'aside.self.display') === false,
      headerLogo: uiService.getLogo()
    };
  }, [uiService]);

  return (
    <>
      {/* begin::Aside */}
      <div id="kt_aside" className={`aside aside-left  ${layoutProps.asideClassesFromConfig} d-flex flex-column flex-row-auto`}>
        <Brand />

        {/* begin::Aside Menu */}
        <div id="kt_aside_menu_wrapper" className="aside-menu-wrapper flex-column-fluid">
          {layoutProps.disableAsideSelfDisplay && (
            <>
              {/* begin::Header Logo */}
              <div className="header-logo">
                <Link to="">
                  <img alt="logo" src={layoutProps.headerLogo} />
                </Link>
              </div>
              {/* end::Header Logo */}
            </>
          )}
          <SidebarMenu disableScroll={layoutProps.disableScroll} />
        </div>
        {/* end::Aside Menu */}
      </div>
      {/* end::Aside */}
    </>
  );
}
