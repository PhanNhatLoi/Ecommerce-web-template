import { Form, Input } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import COLOR from '~/color';
import { LOGIN_PATH } from '~/configs/routesConfig';
import { authActions } from '~/state/ducks/authUser';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { commonValidate, typeValidate } from '~/views/utilities/ant-validation';

function Step1(props) {
  const { checkEmail, initOTP, t, i18n } = props;
  const [isSubmitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    props.setEmail(values.email);
    setSubmitting(true);
    checkEmail(values.email)
      .then((res) => {
        initOTP(values.email)
          .then((res) => {
            props.setStep(2);
            setSubmitting(false);
            props.setFormError(t(null));
          })
          .catch((err) => {
            setSubmitting(false);
            props.setFormError(t(err.message));
          });
      })
      .catch((err) => {
        setSubmitting(false);
        props.setFormError(t(err.message));
      });
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: Step1.js ~ line 63 ~ onFinishFailed ~ err', err);
  };

  useEffect(() => {
    props.setRegisterDes('');
  }, [i18n?.language]); //make sure the language update when chose another language

  return (
    <Form
      form={form}
      id="kt_login_signin_form"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onChange={() => setDisableSubmit(!form.getFieldValue('email'))}>
      {/* begin: Email */}
      <span className="text-title">{t('Email')}</span>
      <Form.Item validateFirst name="email" hasFeedback rules={commonValidate().concat(typeValidate('email'))}>
        <Input size="large" placeholder="Email" type="text" autoFocus allowClear style={{ backgroundColor: 'transparent' }} />
      </Form.Item>
      {/* end: Email */}

      <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
        <div style={{ fontSize: '13px' }}>
          <span className="text-dark-50">{t('have_account')}</span>
          <Link to={LOGIN_PATH} className="ml-2" id="kt_login_signup" style={{ color: COLOR['primary-color'] }}>
            {t('login')}
          </Link>
        </div>
      </div>
      <AButton
        id="kt_login_signin_submit"
        type="primary"
        size="large"
        disabled={disableSubmit}
        loading={isSubmitting}
        style={{ borderRadius: '8px' }}
        block
        htmlType="submit">
        {t('next')}
      </AButton>
    </Form>
  );
}

export default compose(
  withTranslation(),
  connect(
    (state) => ({
      country: state['appData'].country
    }),
    {
      checkEmail: authActions.checkEmail,
      initOTP: authActions.initOTP
    }
  )
)(Step1);
