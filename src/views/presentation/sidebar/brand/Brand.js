import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import objectPath from 'object-path';
import SVG from 'react-inlinesvg';
import { useHtmlClassService } from '../../core/Layout';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import { DEFAULT_PATH } from '~/configs/routesConfig';
import { LOGO_AUTH_URL, SIDEBAR_LOGO_AUTH_URL } from '~/configs/index';
import COLOR from '~/views/utilities/layout/color';
import styled from 'styled-components';

const LineStyled = styled.div`
  width: 80%;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #d1d5db;
  height: 1px;
  margin: auto;
`;

export function Brand() {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      brandClasses: uiService.getClasses('brand', true),
      asideSelfMinimizeToggle: objectPath.get(uiService.config, 'aside.self.minimize.toggle'),
      headerLogo: uiService.getLogo(),
      headerStickyLogo: uiService.getStickyLogo()
    };
  }, [uiService]);

  return (
    <>
      {/* begin::Brand */}
      <div className={`brand flex-column-auto ${layoutProps.brandClasses}`} id="kt_brand">
        {' '}
        {/* default line color: #464a53, option 1: #49565D */}
        {/* begin::Logo */}
        <Link to={DEFAULT_PATH} className="brand-logo">
          <img alt="logo" src={toAbsoluteUrl(LOGO_AUTH_URL)} width={40} height={40} />
          <span className="app-name">
            <SVG src={toAbsoluteUrl('/media/svg/appImage/eCaM.svg')} />
          </span>
        </Link>
        {/* end::Logo */}
        {layoutProps.asideSelfMinimizeToggle && (
          <>
            {/* begin::Toggle */}
            <button
              style={{
                backgroundColor: COLOR.white,
                position: 'absolute',
                right: '-20px',
                width: '35px',
                height: '35px',
                borderRadius: '100%',
                border: 'none',
                filter: 'drop-shadow(2px 0px 1px rgba(0, 0, 0, 0.10))'
              }}
              className="brand-toggle "
              id="kt_aside_toggle">
              <span className="svg-icon svg-icon-xl">
                <SVG src={toAbsoluteUrl('/media/svg/icons/Navigation/arrow_double_right.svg')} />
              </span>
            </button>
            {/* end::Toolbar */}
          </>
        )}
      </div>
      <LineStyled />

      {/* end::Brand */}
    </>
  );
}
