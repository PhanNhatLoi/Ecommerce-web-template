import { Form, Input } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import COLOR from '~/color';
import { LOGIN_PATH } from '~/configs/routesConfig';
import { authActions } from '~/state/ducks/authUser';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { commonValidate, typeValidate } from '~/views/utilities/ant-validation';

function Step1(props) {
  const { initResetPass } = props;
  const { t, i18n } = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    props.setEmail(values.email);
    setSubmitting(true);
    initResetPass({ username: values.email })
      .then((res) => {
        setSubmitting(false);
        props.setStep(2);
        props.setFormError(null);
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
    props.setForgotPassDes(t('forgotpass_step1_des'));
  }, [i18n?.language]);

  const onFormChange = () => {
    setDisableSubmit(!form.getFieldValue('email'));
  };

  return (
    <Form form={form} id="kt_login_signin_form" onFinish={onFinish} onFinishFailed={onFinishFailed} onChange={onFormChange}>
      {/* begin: Email */}
      <Form.Item validateFirst name="email" hasFeedback rules={commonValidate().concat(typeValidate('email'))}>
        <Input size="large" placeholder="Email" type="text" autoFocus allowClear />
      </Form.Item>
      {/* end: Email */}

      <AButton
        id="kt_login_signin_submit"
        size="large"
        type="primary"
        disabled={disableSubmit}
        loading={isSubmitting}
        className="mt-5"
        block
        style={{ borderRadius: '8px' }}
        htmlType="submit">
        {t('next')}
      </AButton>
      <div className="form-group d-flex flex-wrap justify-content-between align-items-center mt-5">
        <div style={{ fontSize: '13px' }}>
          <Link to={LOGIN_PATH} className="ml-2" id="kt_login_signup" style={{ color: COLOR['primary-color'] }}>
            {t('login')}
          </Link>
        </div>
      </div>
    </Form>
  );
}

export default compose(
  connect(null, {
    checkEmail: authActions.checkEmail,
    initResetPass: authActions.initResetPass,
    confirmOTPResetPass: authActions.confirmOTPResetPass,
    finishResetPass: authActions.finishResetPass
  })
)(Step1);
