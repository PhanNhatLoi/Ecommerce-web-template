import React from 'react';
import { Input, Form } from 'antd/es';
import { commonValidate, MAX_LENGTH, passwordValidate } from '~/views/utilities/ant-validation';

function MPasswordInput(props) {
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate().concat(passwordValidate());
  }
  let maxLength = MAX_LENGTH;

  return (
    <div
      className={
        (props.noPadding ? 'px-0  ' : '') +
        (props.noLabel
          ? props.hasLayoutForm
            ? 'col-12 col-sm-12 col-md-12 col-lg-12 col-xl-10'
            : 'col-12'
          : props.oneLine
          ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
          : props.customLayout
          ? props.customLayout
          : props.hasLayoutForm
          ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-5'
          : 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6')
      }>
      {props.copyBtn || <></>}
      <Form.Item label={props?.label || 'MInput'} validateFirst name={props?.name || 'MInput'} hasFeedback rules={rules} {...props}>
        <Input.Password maxLength={maxLength} size={props?.size} placeholder={props?.placeholder || 'MInput'} autoFocus {...props} />
      </Form.Item>
    </div>
  );
}

export default MPasswordInput;
