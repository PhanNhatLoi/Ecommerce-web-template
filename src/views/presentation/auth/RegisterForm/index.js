import React, { useState } from 'react';
import { Alert } from 'antd/es';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import styled from 'styled-components';
import COLOR from '~/views/utilities/layout/color';

const BodyContentStyled = styled.div`
  .ant-input {
    background-color: rgba(255, 255, 255, 0.5);
  }
  span.text-title {
    font-size: 12px;
    color: ${COLOR.gray02};
  }
`;

function Registration(props) {
  const { t } = props;
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState(null);
  const [password, setPassword] = useState('');
  const [registerDes, setRegisterDes] = useState('');
  const [resetKey, setResetKey] = useState('');
  const [registerResult, setRegisterResult] = useState();
  const [bodyRequest, setBodyRequest] = useState();
  const [bodyRequestNotAddress, setBodyRequestNotAddress] = useState();
  const [step, setStep] = useState(1);

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1 //
            setEmail={setEmail}
            setFormError={setFormError}
            setRegisterDes={setRegisterDes}
            setStep={setStep}
          />
        );
      case 2:
        return (
          <Step2 //
            email={email}
            setFormError={setFormError}
            setRegisterDes={setRegisterDes}
            setResetKey={setResetKey}
            setStep={setStep}
          />
        );
      case 3:
        return (
          <Step3 //
            setPassword={setPassword}
            setRegisterDes={setRegisterDes}
            setStep={setStep}
          />
        );
      case 4:
        return (
          <Step4 //
            email={email}
            password={password}
            resetKey={resetKey}
            bodyRequest={bodyRequest}
            bodyRequestNotAddress={bodyRequestNotAddress}
            setFormError={setFormError}
            setRegisterDes={setRegisterDes}
            setBodyRequest={setBodyRequest}
            setStep={setStep}
          />
        );
      case 5:
        return (
          <Step5 //
            setRegisterDes={setRegisterDes}
            setBodyRequest={setBodyRequest}
            setStep={setStep}
          />
        );
      case 6:
        return (
          <Step6 //
            email={email}
            password={password}
            resetKey={resetKey}
            bodyRequest={bodyRequest}
            setFormError={setFormError}
            setRegisterDes={setRegisterDes}
            setBodyRequest={setBodyRequest}
            setStep={setStep}
            setRegisterResult={setRegisterResult}
          />
        );
      case 7:
        return (
          <Step7 //
            setFormError={setFormError}
            setRegisterDes={setRegisterDes}
            bodyRequest={bodyRequest}
            registerResult={registerResult}
          />
        );
      default:
        return;
    }
  };

  return (
    <BodyContentStyled className="login-form login-signin" style={{ display: 'block', minHeight: '300px' }}>
      <div className="mb-10 mb-lg-20">
        <h3 className="text-center font-size-h1 mb-5 d-lg-none">{step === 7 ? t('successful_registration') : t('sign_up_title')}</h3>
        <p className="text-center text-truncate font-weight-bold mb-10" style={{ fontSize: '14px' }}>
          {registerDes}
        </p>
        {formError && (
          <div className="mb-10">
            <Alert message={formError} type="error" showIcon />
          </div>
        )}
        {renderContent()}
      </div>
    </BodyContentStyled>
  );
}

export default compose(withTranslation(), connect(null))(Registration);
