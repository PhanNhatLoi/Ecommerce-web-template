import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import COLOR from '~/color';
import { LOGIN_PATH } from '~/configs/routesConfig';
import { authActions } from '~/state/ducks/authUser';
import useInterval from '~/views/hooks/UseInterval';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import OtpInput from '~/views/presentation/ui/OTP-input';
import { commonValidate } from '~/views/utilities/ant-validation';

function Step2(props) {
  const { confirmOTPResetPass, initOTP, t, i18n } = props;
  const [form] = Form.useForm();
  const [isSubmitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [delay, setDelay] = useState(1000);

  useInterval(
    () => {
      setTimer(timer - 1);
      if (timer <= 0) setDelay(null);
    },
    // Delay in milliseconds or null to stop it
    delay
  );

  const onFinish = (values) => {
    if (timer <= 0) {
      props.setFormError(t('otpExpired'));
    } else {
      setSubmitting(true);
      confirmOTPResetPass({ username: props.email, otp: values.otp })
        .then((res) => {
          props.setResetKey(res?.content?.resetKey);
          props.setStep(3);
          setSubmitting(false);
          props.setFormError(t(null));
        })
        .catch((err) => {
          setSubmitting(false);
          props.setFormError(t(err.message));
        });
    }
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: Step2.js ~ line 49 ~ onFinishFailed ~ err', err);
  };

  const resendOtp = () => {
    setResendLoading(true);
    initOTP(props.email)
      .then((res) => {
        setResendLoading(false);
        AMessage.success(t('resend_otp_success'));
        // reset timer
        setTimer(60);
        setDelay(1000);
        props.setFormError(t(null));
      })
      .catch((err) => {
        setResendLoading(false);
        props.setFormError(t(err.message));
      });
  };

  const hideEmail = (email) => {
    return email.replace(/(.{2})(.*)(?=@)/, function (gp1, gp2, gp3) {
      for (let i = 0; i < gp3.length; i++) {
        gp2 += '*';
      }
      return gp2;
    });
  };

  useEffect(() => {
    props.setForgotPassDes(
      <div>
        {t('otp_des')}
        <br />
        <h2>{hideEmail(props.email)}</h2>
      </div>
    );
  }, [i18n?.language]);

  const onFormChange = () => {
    setDisableSubmit(!form.getFieldValue('otp') || form.getFieldValue('otp').length < 6);
  };

  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} onChange={onFormChange} id="kt_login_signin_form">
      <Form.Item validateFirst name="otp" rules={commonValidate()}>
        <OtpInput OTPLength={6} inputClassName="form-control form-control-solid" autoFocus={true} otpType="number" />
      </Form.Item>

      <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
        <div style={{ fontSize: '13px' }}>
          <Link to={LOGIN_PATH} className="ml-2" id="kt_login_signup" style={{ color: COLOR['primary-color'] }}>
            {t('login')}
          </Link>
        </div>
        {timer <= 0 ? (
          <AButton
            loading={resendLoading}
            type="link"
            className="mt-3 pr-0"
            onClick={resendOtp}
            style={{ textAlign: 'right', color: COLOR['primary-color'] }}>
            {t('resend_otp')}
          </AButton>
        ) : (
          <p style={{ fontSize: '13px' }}>{`${timer}s`}</p>
        )}
      </div>
      <AButton
        id="kt_login_signin_submit"
        type="primary"
        size="large"
        disabled={disableSubmit}
        style={{ borderRadius: '8px' }}
        loading={isSubmitting}
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
      confirmOTPResetPass: authActions.confirmOTPResetPass,
      initOTP: authActions.initOTP
    }
  )
)(Step2);
