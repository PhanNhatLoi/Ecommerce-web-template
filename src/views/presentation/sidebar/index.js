import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import objectPath from 'object-path';
import { SidebarMenu } from './menus/SidebarMenu';
import { useHtmlClassService } from '../core/Layout';
import { Brand } from './brand/Brand';
import COLOR from '~/views/utilities/layout/color';
import styled from 'styled-components';

const ContentStyled = styled.div`
  box-shadow: 2px 0px 1px 0px rgba(0, 0, 0, 0.1);
  @media (max-width: 992px) {
    background-color: ${COLOR.White};
  }
`;

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
    <ContentStyled
      id="kt_aside"
      className={`aside aside-left  ${layoutProps.asideClassesFromConfig} d-flex flex-column flex-row-auto ${layoutProps.menuWidth} `}>
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
    </ContentStyled>
  );
  {
    /* end::Aside */
  }
}
