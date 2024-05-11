import '~/static/scss/pages/login/classic/login-1.scss';

import { Segmented } from 'antd/es';
import objectPath from 'object-path';
import React, { lazy, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { FULL_LOGO_URL_2, LOGO_AUTH_URL } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { useHtmlClassService } from '~/views/presentation/core/Layout';
import { LanguageSelectorDropdown } from '~/views/presentation/extras/dropdowns/LanguageSelectorDropdown';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import COLOR from '~/views/utilities/layout/color';

const ContainerBodyStyled = styled.div`
  position: relative;
  @media (min-width: 992px) {
    background: linear-gradient(12deg, #d7e5ff -8.68%, #eafff4 109.3%);
  }
  background-repeat: no-repeat;
  background-size: cover;

  .left-content {
    padding: 25px;
    @media (min-width: 1200px) {
      width: 80%;
    }
    @media (max-width: 1199px) and (min-width: 960px) {
      width: 80%;
    }
    @media (max-width: 992px) {
      display: none;
    }
  }

  .title {
    font-size: 24px;
    color: ${COLOR.textTitle};
    font-weight: 700;
    @media (min-width: 1920px) {
      font-size: 32px;
    }
  }

  .text-basic {
    font-size: 16px;
    color: ${COLOR.textBasic};
    font-weight: 400;
    text-align: justify;
    @media (min-width: 1920px) {
      font-size: 18px;
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: ${COLOR.gray02};
    font-sise: 16px;
    @media (max-width: 600px) {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
  .footer a {
    color: ${COLOR.gray02};
  }

  .form-body {
    width: 100%;
    @media (min-width: 992px) {
      max-width: 850px;
      min-width: 450px;
      width: 70%;
      height: 100%;
      background: ${COLOR.white};
      border: 1px solid #fff;
      border-radius: 26px;
      box-shadow: 0px 10px 70px 0px rgba(0, 0, 0, 0.15);
    }
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-between;
  }
  .footer-2 {
    background: rgba(243, 244, 246, 0.7);
    border-radius: 0px 0px 26px 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 100%;
    @media (max-width: 992px) {
      display: none;
    }
  }
  .segmented {
    width: 78%;
    margin-top: 50px;
    @media (max-width: 992px) {
      display: none;
    }
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .right-content {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 100px 80px;
    @media (max-width: 600px) {
      padding: 15px;
      margin-bottom: 20px;
    }
  }

  // ant custom design
  .ant-segmented {
    border-radius: 36px;
    background: rgba(32, 127, 167, 0.1);
  }

  .ant-segmented-item {
    color: ${COLOR.systemColor};
    border-radius: 36px;
    padding: 6px 16px 6px 16px;
    margin: -1px;
  }
  .ant-segmented-item-selected {
    background-color: ${COLOR.systemColor};
    color: ${COLOR.white};
  }
  .ant-segmented-thumb-motion {
    background-color: ${COLOR.systemColor};
    border-radius: 36px;
  }
  // ant custom design
`;

const LoginForm = lazy(() => import('./LoginForm'));
const RegisterForm = lazy(() => import('./RegisterForm'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));

export default function AuthPage() {
  const location = useLocation();
  const { t }: any = useTranslation();
  const { width, height } = useWindowSize();
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      viewLanguagesDisplay: objectPath.get(uiService.config, 'extras.languages.display')
    };
  }, [uiService]);
  const history = useHistory();

  const renderPage = () => {
    switch (location.pathname) {
      case PATH.LOGIN_PATH:
        return <LoginForm />;

      case PATH.REGISTER_PATH:
        return <RegisterForm />;

      case PATH.FORGOT_PASSWORD_PATH:
        return <ForgotPassword />;

      default:
        return;
    }
  };

  const handleChangeTab = (e) => {
    setTimeout(() => {
      history.push(e);
    }, 500);
  };

  const options = [
    {
      value: 'login',
      label: t('login')
    },
    {
      value: 'register',
      label: t('sign_up_title')
    }
  ];

  return (
    <div className="d-flex flex-column flex-root bg-white">
      {/*begin::Login*/}
      <ContainerBodyStyled className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid" id="kt_login">
        {/*begin::Aside*/}
        {layoutProps.viewLanguagesDisplay && (
          <div style={{ position: 'absolute', right: '20px', top: '10px' }}>
            <LanguageSelectorDropdown />
          </div>
        )}
        <div className="left-content">
          {/*begin: Aside Container*/}
          <div className="d-flex flex-row-fluid flex-column justify-content-between" style={{ zIndex: 2 }}>
            {/* start:: Aside header */}
            <Link to="/" className="flex-column mt-5 pb-lg-0 pb-10 text-left" style={{ position: 'relative', left: 8 }}>
              <img alt="Logo" className="max-h-50px max-h-xl-70px" src={toAbsoluteUrl(FULL_LOGO_URL_2)} />
            </Link>
            {/* end:: Aside header */}

            {/* start:: Aside content */}
            <div className="flex-column-fluid d-flex flex-column  p-5 mt-5">
              <div>
                <div className="title mb-6">
                  <span>{t('welcome_secondary')}</span>
                </div>
                <div className="text-basic">
                  <span>{t('welcome_des')}</span>
                </div>
                <SVG src={toAbsoluteUrl('/media/logos/ren3-suvcar.svg')} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
            {/* end:: Aside content */}
          </div>
          {/*end: Aside Container*/}
        </div>
        <div className="right-content">
          <div className="form-body">
            <img alt="Logo" className="max-h-50px max-h-xl-70px d-lg-none mb-10 d-block" src={toAbsoluteUrl(LOGO_AUTH_URL)} />
            <div className="segmented">
              {location.pathname !== PATH.FORGOT_PASSWORD_PATH && (
                <Segmented options={options} defaultValue={location.pathname.replace('/', '')} onChange={(e) => handleChangeTab(e)} />
              )}
            </div>
            <div className="content">{renderPage()}</div>
            <div className="footer-2">
              <div className="copyright">
                Copyright &copy; 2022 eCarAid Inc, | Powered by{' '}
                <ATypography
                  variant={TYPOGRAPHY_TYPE.LINK}
                  href="https://www.ecaraid.com"
                  target="_blank"
                  style={{ color: COLOR.systemColor, textDecoration: 'underline' }}>
                  eCarAid JSC
                </ATypography>
              </div>
            </div>
          </div>
        </div>
        {/*begin::Aside*/}
        {/* start:: Aside footer for desktop */}
        <div className="footer p-10 p-lg-10">
          <div className="d-flex">
            <div className="copyright">
              Copyright &copy; 2022 eCarAid Inc, | Powered by{' '}
              <ATypography
                variant={TYPOGRAPHY_TYPE.LINK}
                href="https://www.ecaraid.com"
                target="_blank"
                style={{ color: COLOR.blue02, textDecoration: 'underline' }}>
                eCarAid JSC
              </ATypography>
            </div>
          </div>
          <div>
            <a href="https://ecaraid.com/privacy-policy/">{t('privacy_policy')}</a>
            <span> | </span>
            <a href="https://ecaraid.com/terms-of-service/">{t('terms_of_service')}</a>
          </div>
        </div>
        {/* end:: Aside footer for desktop */}
      </ContainerBodyStyled>
      {/*end::Login*/}
    </div>
  );
}
