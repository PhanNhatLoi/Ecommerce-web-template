import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Color } from '~/views/utilities/layout';

const InputStyle = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 18px;
  margin-right: 20px;
  padding-bottom: 8px;
  background: #fff !important;
  border: none !important;
  border-bottom: 1px solid #000 !important;
  border-radius: 2px;
  &:focus {
    border-bottom: 1px solid #3699FF !important;
    outline: none;
  }

  @media screen and (max-width: 576px) {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
`;

/**
 * This is react stateless component
 * Renders an input box
 * @param {Object} {
 *   focus,
 *   autoFocus,
 *   disabled,
 *   value,
 *   secure,
 *   ...rest
 * }
 * @returns
 */
const Input = ({ focus, autoFocus, disabled, value, onInputFocus, index, secure, inputStyles, otpType, ...rest }) => {
  const input = useRef(null);
  const componentMounted = useRef(false);
  useEffect(() => {
    // When component mounts
    if (autoFocus && focus) {
      input.current.focus();
    }
  }, []);

  useEffect(() => {
    // When component focus updates
    if (componentMounted.current && focus) {
      input.current.focus();
    }
    componentMounted.current = true;
  }, [focus]);

  const handelInputFocus = (event) => onInputFocus(index, event);
  let inputType = 'text';
  if (secure) {
    inputType = 'password';
  } else if (otpType === 'number') {
    inputType = 'tel';
  }
  return (
    <InputStyle
      // style={{ ...inputDefaultStyles, ...inputStyles }}
      type={inputType}
      maxLength="1"
      ref={input}
      disabled={disabled}
      onFocus={handelInputFocus}
      value={value || ''}
      {...rest}
    />
  );
};

Input.propTypes = {
  focus: PropTypes.bool,
  autoFocus: PropTypes.bool,
  numInputs: PropTypes.number,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  secure: PropTypes.bool,
  inputStyles: PropTypes.object,
  otpType: PropTypes.oneOf(['number', 'alpha', 'alphanumeric', 'any'])
};

export default React.memo(Input);
