import { Alert } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { authActions } from '~/state/ducks/authUser';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

function ForgotPassword(props) {
  const { t } = useTranslation();
  const [resetKey, setResetKey] = useState('');
  const [formError, setFormError] = useState(null);
  const [forgotPassDes, setForgotPassDes] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1 //
            setEmail={setEmail}
            setFormError={setFormError}
            setForgotPassDes={setForgotPassDes}
            setStep={setStep}
          />
        );
      case 2:
        return (
          <Step2 //
            email={email}
            setFormError={setFormError}
            setForgotPassDes={setForgotPassDes}
            setResetKey={setResetKey}
            setStep={setStep}
          />
        );
      case 3:
        return (
          <Step3 //
            resetKey={resetKey}
            setForgotPassDes={setForgotPassDes}
            setStep={setStep}
          />
        );

      default:
        return;
    }
  };

  return (
    <div className="login-form login-signin" style={{ display: 'block' }}>
      <div className="mb-10 mb-lg-20">
        <h3 className="text-center font-size-h1 mb-5">{t('forgot_pass')}</h3>
        <p className="text-center font-weight-bold mb-10" style={{ fontSize: '14px' }}>
          {forgotPassDes}
        </p>
        {formError && (
          <div className="mb-10">
            <Alert message={formError} type="error" showIcon />
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}

export default compose(
  connect(null, {
    checkEmail: authActions.checkEmail,
    initResetPass: authActions.initResetPass,
    confirmOTPResetPass: authActions.confirmOTPResetPass,
    finishResetPass: authActions.finishResetPass
  })
)(ForgotPassword);
