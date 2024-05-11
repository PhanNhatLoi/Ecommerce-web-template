import objectPath from 'object-path';
import { useMemo, useEffect } from 'react';
import { Footer } from '../footer/Footer';
import { HeaderMobile } from '../header-mobile/HeaderMobile';
import { Header } from '../header/Header';
import Sidebar from '../sidebar';
import { SubHeader } from '../subheader/SubHeader';
import { useHtmlClassService } from './Layout';
import { LayoutInit } from './LayoutInit';
import { ScrollTop } from './ScrollTop';
import { messaging } from '~/init-fcm';
import store from '~/state/store';
import { setUnreadNotification } from '~/state/ducks/authUser/actions';

function AppContentWrapper({ children }) {
  const uiService = useHtmlClassService();
  // Layout settings (cssClasses/cssAttributes)
  const layoutProps = useMemo(() => {
    return {
      layoutConfig: uiService.config,
      selfLayout: objectPath.get(uiService.config, 'self.layout'),
      asideDisplay: objectPath.get(uiService.config, 'aside.self.display'),
      subheaderDisplay: objectPath.get(uiService.config, 'subheader.display'),
      desktopHeaderDisplay: objectPath.get(uiService.config, 'header.self.fixed.desktop'),
      contentCssClasses: uiService.getClasses('content', true),
      contentContainerClasses: uiService.getClasses('content_container', true),
      contentExtended: objectPath.get(uiService.config, 'content.extended')
    };
  }, [uiService]);

  useEffect(() => {
    if (messaging) {
      messaging.onMessage((payload) => {
        store.dispatch(setUnreadNotification());
      });
    }
  });

  return layoutProps.selfLayout !== 'blank' ? (
    <>
      {/*begin::Main*/}
      <HeaderMobile />
      <div className="d-flex flex-column flex-root ">
        {/*begin::Page*/}
        <div className="d-flex flex-row flex-column-fluid page">
          {layoutProps.asideDisplay && <Sidebar />}
          {/*begin::Wrapper*/}
          <div className="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">
            <Header />
            {/*begin::Content*/}
            <div id="kt_content" className={`content ${layoutProps.contentCssClasses} d-flex flex-column flex-column-fluid`}>
              {layoutProps.subheaderDisplay && <SubHeader />}
              {/*begin::Entry*/}
              {!layoutProps.contentExtended && (
                <div className="d-flex flex-column-fluid">
                  {/*begin::Container*/}
                  <div className={layoutProps.contentContainerClasses}>{children}</div>
                  {/*end::Container*/}
                </div>
              )}

              {layoutProps.contentExtended && { children }}
              {/*end::Entry*/}
            </div>
            {/*end::Content*/}
            <Footer />
          </div>
          {/*end::Wrapper*/}
        </div>
        {/*end::Page*/}
      </div>
      <ScrollTop />

      {/*end::Main*/}

      <LayoutInit />
    </>
  ) : (
    <div className="d-flex flex-column flex-root">{children}</div>
  );
}
export default AppContentWrapper;
