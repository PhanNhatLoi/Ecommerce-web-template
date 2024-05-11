// @flow
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import useOTP from '../hooks/useOTP';
import styled from 'styled-components';

const WrapInputs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  input:last-child {
    margin-right: 0px;
  }
`;

const OtpInput = ({
  OTPLength,
  disabled,
  autoFocus,
  value = '',
  onChange,
  otpType,
  secure,
  className,
  inputClassName,
  inputStyles,
  style
}) => {
  const { activeInput, getOtpValue, handleOnChange, handleOnKeyDown, handelOnInput, handleOnPaste, onInputFocus } = useOTP({
    autoFocus,
    value,
    otpType,
    onChange,
    OTPLength
  });

  // Needs to be memorized
  const renderInputs = useMemo(() => {
    const otp = getOtpValue();
    const inputs = [];

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < OTPLength; index++) {
      inputs.push(
        <Input
          className={inputClassName}
          inputStyles={inputStyles}
          key={index}
          focus={activeInput === index}
          autoFocus={autoFocus}
          value={otp[index]}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          onInput={handelOnInput}
          onPaste={handleOnPaste}
          onInputFocus={onInputFocus}
          index={index}
          disabled={disabled}
          secure={secure}
          data-testid="input"
          otpType={otpType}
        />
      );
    }

    return inputs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getOtpValue,
    OTPLength,
    inputClassName,
    inputStyles,
    activeInput,
    handleOnChange,
    handleOnKeyDown,
    handelOnInput,
    handleOnPaste,
    onInputFocus,
    disabled,
    autoFocus,
    secure
  ]);

  return (
    <WrapInputs style={{ ...style }} className={className} data-testid="otp-input-root">
      {renderInputs}
    </WrapInputs>
  );
};

OtpInput.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  OTPLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  secure: PropTypes.bool,
  otpType: PropTypes.oneOf(['number', 'alpha', 'alphanumeric', 'any']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputStyles: PropTypes.object,
  style: PropTypes.object
};

OtpInput.defaultProps = {
  className: '',
  inputClassName: '',
  OTPLength: 4,
  onChange: () => {},
  disabled: false,
  secure: false,
  autoFocus: false,
  value: '',
  otpType: 'any',
  inputStyles: {},
  style: {}
};

export default OtpInput;
