/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import moment from 'moment';
import objectPath from 'object-path';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import DashboardChooseDate from '~/views/container/commons/DashboardChooseDate';

import { useHtmlClassService } from '../core/Layout';
import { getBreadcrumbsAndTitle, useSubheader } from '../core/Subheader';
import { BreadCrumbs } from './components/BreadCrumbs';

const WrapperStyled = styled.div`
  width: 100% !important;
`;

export function SubHeader() {
  const { t } = useTranslation();
  const uiService = useHtmlClassService();
  const location = useLocation();
  const subheader = useSubheader();
  const fromDate = moment().subtract(12, 'months');
  const toDate = moment();

  const {
    useDates,
    dates: { from, to, type },
    setDates,
    setDashboardDate
  } = subheader;

  const layoutProps = useMemo(() => {
    return {
      config: uiService.config,
      subheaderMobileToggle: objectPath.get(uiService.config, 'subheader.mobile-toggle'),
      subheaderCssClasses: uiService.getClasses('subheader', true),
      subheaderContainerCssClasses: uiService.getClasses('subheader_container', true)
    };
  }, [uiService]);

  const handleChaneDates = ({ from, to, type }) => {
    setDates({ from, to, type });
  };

  useLayoutEffect(() => {
    const aside = getBreadcrumbsAndTitle('kt_aside_menu', location.pathname);
    const header = getBreadcrumbsAndTitle('kt_header_menu', location.pathname);
    const breadcrumbs = aside && aside.breadcrumbs.length > 0 ? aside.breadcrumbs : header.breadcrumbs;
    subheader.setBreadcrumbs(breadcrumbs);
    subheader.setTitle(aside && aside.title && aside.title.length > 0 ? aside.title : header.title);
    // eslint-disable-next-line
  }, [location.pathname]);

  const isDashboardPath = () =>
    subheader.breadcrumbs.some((item) =>
      [
        PATH.DASHBOARD_PATH,
        PATH.AUTO_CLUB_DASHBOARD_PATH,
        PATH.CAR_SERVICES_DASHBOARD_PATH,
        PATH.CAR_ACCESSORIES_DASHBOARD_PATH,
        PATH.INSURANCE_DASHBOARD_PATH,
        PATH.USED_CAR_TRADING_DASHBOARD_PATH
      ].includes(item.pathname)
    );

  return (
    <div
      id="kt_subheader"
      className={`d-print-none subheader ${isDashboardPath() ? 'py-2 py-lg-15 py-xl-15' : 'py-2 py-lg-4'} ${
        layoutProps.subheaderCssClasses
      }`}>
      <div
        className={`${layoutProps.subheaderContainerCssClasses} d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap`}>
        {/* Info */}
        <WrapperStyled className="d-flex flex-column flex-wrap align-items-start mr-1 pl-0">
          {layoutProps.subheaderMobileToggle && (
            <button className="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none" id="kt_subheader_mobile_toggle">
              <span />
            </button>
          )}

          <WrapperStyled className={`d-flex flex-wrap mr-5 ${isDashboardPath() ? 'mt-4' : ''}`}>
            <h1 className="text-dark font-weight-bold my-2 mr-5">{subheader.title}</h1>
            <BreadCrumbs items={subheader.breadcrumbs} />
          </WrapperStyled>

          <WrapperStyled>
            {subheader.breadcrumbs.some((item) => isDashboardPath()) && <DashboardChooseDate setParams={setDashboardDate} />}
          </WrapperStyled>
        </WrapperStyled>

        {/* Toolbar */}
        {/* <div className="d-flex align-items-center col-xl-4 col-lg-5 col-md-6 col-sm-7 p-0 justify-content-end">
          {useDates && (
            <ChooseDate
              rangeType={['today', 'week', 'month', 'year', 'custom', '']}
              onChangeValues={handleChaneDates}
              defaultFrom={from}
              defaultTo={to}
              defaultType={type}
            />
          )}
        </div> */}
      </div>
    </div>
  );
}
