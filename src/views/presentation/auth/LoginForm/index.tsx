import { Alert, Button, Form, Input } from 'antd/es';
import objectPath from 'object-path';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FIREBASE_VAPIKEY } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { messaging } from '~/init-fcm';
import { appDataActions } from '~/state/ducks/appData';
import { authActions } from '~/state/ducks/authUser';
import { setAccessNotification } from '~/state/ducks/authUser/actions';
import store from '~/state/store';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { commonValidate, typeValidate } from '~/views/utilities/ant-validation';
import COLOR from '~/views/utilities/layout/color';
import AButton from '~/views/presentation/ui/buttons/AButton';

import VendorNotApprovedMessage from '../RegisterForm/Step7';

const BodyContentStyled = styled.div`
  .ant-input {
    background-color: rgba(255, 255, 255, 0.5);
  }
  span.text-title {
    font-size: 12px;
    color: ${COLOR.gray02};
  }
`;

const InputStyled = styled(Input)`
  .anticon.ant-input-clear-icon-has-suffix,
  .ant-input-clear-icon-has-suffix {
    line-height: initial;
  }
  .ant-form-item-feedback-icon {
    line-height: initial;
    margin-bottom: 1px;
  }
`;

const InputPasswordStyled = styled(Input.Password)`
  .anticon.ant-input-clear-icon-has-suffix,
  .ant-input-clear-icon-has-suffix {
    line-height: initial;
  }
  .ant-input-password-icon.anticon {
    line-height: initial;
    margin-bottom: 1px;
  }
  .ant-form-item-feedback-icon {
    line-height: initial;
    margin-bottom: 1px;
  }
`;

function Login(props) {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [vendorNotApproved, setVendorNotApproved] = useState(false);
  const [vendorRejected, setVendorRejected] = useState(false);
  const [form] = Form.useForm();

  const fetchData = (action) => {
    action
      .then((res) => {})
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 31 ~ props.getUser ~ err', err);
      });
  };

  const getVendorRoleBase = () => {
    props
      .getRoleBase()
      .then((res) => {
        const pageAccessNotification = res?.content?.pagePermissions?.filter(
          (role) => [PATH.CAR_ACCESSORIES_SALES_ORDERS_PATH, PATH.INSURANCE_ORDER_LIST_PATH].includes(role.path) && role.access
        );

        if (pageAccessNotification?.every((page) => page?.access?.nonAccess)) {
          store.dispatch(setAccessNotification(false));
        } else {
          updateFirebaseToken();
          fetchData(props.getNotificationUnreadQuantity({ group: 'ORDER' }));
          fetchData(props.getNewOrderQuantity());
          fetchData(props.getNewInsuranceOrderQuantity());
          store.dispatch(setAccessNotification(true));
        }
      })
      .catch((err) => {
        console.error('🚀 ~ file: index.js:46 ~ getVendorRoleBase ~ err', err);
      });
  };

  const updateFirebaseToken = () => {
    // update firebase token
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    if (messaging) {
      messaging
        .getToken({ vapidKey: FIREBASE_VAPIKEY })
        .then((currentToken) => {
          if (currentToken) {
            props
              .updateFirebaseToken({ token: currentToken })
              .then((res) => {})
              .catch((err) => {
                console.error('trandev ~ file: index.js ~ line 60 ~ props.updateFirebaseToken ~ err', err);
              });
          } else {
            // Show permission request UI
            AMessage.error('No registration token available. Request permission to generate one.');
            // ...
          }
        })
        .catch((err) => {
          console.error('trandev ~ file: index.js ~ line 84 ~ .then ~ err', err);
          // if block notification in browser, this message will show
          // AMessage.error('An error occurred while retrieving token. ', err);
          // ...
        });
    }
  };

  const onFinish = (values) => {
    setSubmitting(true);
    const body = {
      username: values.email,
      password: values.password,
      rememberMe: true
    };
    props
      .login(body)
      .then((res) => {
        fetchData(props.getUser());
        fetchData(props.getListCountry());
        getVendorRoleBase();
        setFormError(null);
        setSubmitting(false);
        history.push(PATH.DASHBOARD_PATH);
      })
      .catch((err) => {
        setSubmitting(false);
        switch (objectPath.get(err, 'message')) {
          case 'errorUserWaitingForApproval':
            setVendorNotApproved(true);
            break;
          case 'errorUserRejected':
            setVendorRejected(true);
            break;
          default:
            setFormError(t(`${objectPath.get(err, 'message')}`));
            break;
        }
      });
  };

  const onFinishFailed = (err) => {
    console.error('ithoangtan ~ file: index.js ~ line 94 ~ onFinishFailed ~ err', err);
  };

  const onFormChange = () => {
    setDisableSubmit(!form.getFieldValue('email') || !form.getFieldValue('password'));
  };

  return (
    <BodyContentStyled className="login-form login-signin" id="kt_login_signin_form" style={{ display: 'block' }}>
      <h3 className="text-center font-size-h1 mb-5 d-lg-none" style={{ color: COLOR['primary-color'] }}>
        {t('login')}
      </h3>
      {/* begin::Head */}
      {/* <div className="text-center mb-10 mb-lg-10">
        <h3 className="text-center font-size-h1 mb-5" style={{ color: COLOR['primary-color'] }}>
          {t('login')}
        </h3>
        <p className="text-center font-weight-bold" style={{ fontSize: '14px' }}>
          {t('login_account_des')}
        </p>
      </div> */}
      {/* end::Head */}

      {/*begin::Form*/}
      {vendorNotApproved || vendorRejected ? (
        <VendorNotApprovedMessage
          backToLoginForm={() => {
            setVendorNotApproved(false);
            setVendorRejected(false);
          }}
          content={
            vendorNotApproved ? (
              <div className="text-justify mb-20">
                <p>{t('registration_thank_you_note')}</p>
                <p>{t('login_after_activated')}</p>
                <p>{t('support_anytime')}</p>
              </div>
            ) : (
              <div className="text-justify mb-5">
                <p>{t('vendorRejectedErrorContent')}</p>
                <p>
                  Email: <a href="mailto:support@ecaraid.com">support@ecaraid.com</a>
                </p>
              </div>
            )
          }
          setFormError={setFormError}
          setRegisterDes={() => {}}
        />
      ) : (
        <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} onChange={onFormChange}>
          {formError && (
            <div className="mb-10">
              <Alert message={formError} type="error" showIcon />
            </div>
          )}

          {/* begin: Username */}
          <span className="text-title">{t('Email')}</span>
          <Form.Item validateFirst name="email" hasFeedback rules={commonValidate().concat(typeValidate('email'))}>
            <InputStyled size="large" placeholder="Email" type="text" autoFocus allowClear style={{ backgroundColor: 'transparent' }} />
          </Form.Item>
          {/* end: Username */}

          {/* begin: Password */}
          <span className="text-title">{t('password')}</span>
          <Form.Item validateFirst name="password" hasFeedback rules={commonValidate().concat(typeValidate('string'))}>
            <InputPasswordStyled size="large" placeholder={t('password')} allowClear style={{ backgroundColor: 'transparent' }} />
          </Form.Item>
          {/* end: Password */}

          <div className="form-group d-flex flex-wrap justify-content-end align-items-center">
            <Link
              style={{ fontSize: '13px', color: COLOR.systemColor }}
              to={PATH.FORGOT_PASSWORD_PATH}
              className="my-3"
              id="kt_login_forgot">
              {t('forgot_pass')}
            </Link>
          </div>
          <AButton
            disabled={disableSubmit}
            loading={isSubmitting}
            type="primary"
            size="large"
            id="kt_login_signin_submit"
            style={{ borderRadius: '8px', fontWeight: 'bold' }}
            block
            htmlType="submit">
            {t('login')}
          </AButton>
          <div className="text-center mt-5" style={{ fontSize: '13px' }}>
            <span className="text-dark-50">{t('dont_have_account')}</span>
            <Link style={{ color: COLOR.systemColor }} to={PATH.REGISTER_PATH} className="ml-2 font-size-p" id="kt_login_signup">
              {t('sign_up')}
            </Link>
          </div>
        </Form>
      )}
    </BodyContentStyled>
  );
}

export default connect(null, {
  login: authActions.login,
  getUser: authActions.getUser,
  getRoleBase: authActions.getRoleBase,
  getListCountry: appDataActions.getListCountry,
  updateFirebaseToken: appDataActions.updateFirebaseToken,
  getNotificationUnreadQuantity: authActions.getNotificationUnreadQuantity,
  getNewOrderQuantity: authActions.getNewOrderQuantity,
  getNewInsuranceOrderQuantity: authActions.getNewInsuranceOrderQuantity
})(Login);
