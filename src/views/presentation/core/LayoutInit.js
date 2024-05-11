import React, { useLayoutEffect } from 'react';
import { KTUtil } from '~/static/js/components/util';
import KTLayoutAside from '~/static/js/layout/base/aside';
import KTLayoutAsideMenu from '~/static/js/layout/base/aside-menu';
import KTLayoutAsideToggle from '~/static/js/layout/base/aside-toggle';
import KTLayoutBrand from '~/static/js/layout/base/brand';
import KTLayoutContent from '~/static/js/layout/base/content';
import KTLayoutFooter from '~/static/js/layout/base/footer';
import KTLayoutHeader from '~/static/js/layout/base/header';
import KTLayoutHeaderMenu from '~/static/js/layout/base/header-menu';
import KTLayoutHeaderTopbar from '~/static/js/layout/base/header-topbar';
import KTLayoutStickyCard from '~/static/js/layout/base/sticky-card';
import KTLayoutStretchedCard from '~/static/js/layout/base/stretched-card';
import KTLayoutSubheader from '~/static/js/layout/base/subheader';
import KTLayoutQuickPanel from '~/static/js/layout/extended/quick-panel';
import KTLayoutQuickUser from '~/static/js/layout/extended/quick-user';
import KTLayoutScrolltop from '~/static/js/layout/extended/scrolltop';

export function LayoutInit() {
  useLayoutEffect(() => {
    // Initialization
    KTUtil.ready(function () {
      ////////////////////////////////////////////////////
      // Layout Base Partials(mandatory for core layout)//
      ////////////////////////////////////////////////////
      // Init Desktop & Mobile Headers
      KTLayoutHeader.init('kt_header', 'kt_header_mobile');

      // Init Header Menu
      KTLayoutHeaderMenu.init('kt_header_menu', 'kt_header_menu_wrapper');
      // Init Header Topbar For Mobile Mode
      KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
      // Init Brand Panel For Logo
      KTLayoutBrand.init('kt_brand');
      // Init Aside
      KTLayoutAside.init('kt_aside');

      // Init Aside Menu Toggle
      KTLayoutAsideToggle.init('kt_aside_toggle');
      //
      // Init Aside Menu
      KTLayoutAsideMenu.init('kt_aside_menu');

      // Init Content
      KTLayoutContent.init('kt_content');

      // Init Footer
      KTLayoutFooter.init('kt_footer');

      //////////////////////////////////////////////
      // Layout Extended Partials(optional to use)//
      //////////////////////////////////////////////
      KTLayoutSubheader.init('kt_subheader');

      // Init Scrolltop
      KTLayoutScrolltop.init('kt_scrolltop');

      // Init Sticky Card
      KTLayoutStickyCard.init('kt_page_sticky_card');

      // Init Stretched Card
      KTLayoutStretchedCard.init('kt_page_stretched_card');

      // Init Quick Offcanvas Panel
      KTLayoutQuickPanel.init('kt_quick_panel');

      // Init Quick User Panel
      KTLayoutQuickUser.init('kt_quick_user');
    });
  }, []);
  return <></>;
}
