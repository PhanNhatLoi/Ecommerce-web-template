import React from 'react';
import { Input, Form } from 'antd/es';
import { commonValidate, MAX_LENGTH, typeValidate, phoneValidate } from '~/views/utilities/ant-validation';
import styled from 'styled-components';
import COLOR from '~/views/utilities/layout/color';

const { TextArea } = Input;

const TextAreaWrapper = styled.div`
  .ant-input-affix-wrapper {
    border: 1px solid ${COLOR.Black} !important;
  }

  .ant-input[disabled] {
    color: ${COLOR.Black};
  }
  .ant-input-textarea-suffix {
    align-items: flex-start;
    padding-top: 10px;
  }

  .ant-form-item-label {
    text-align: left;
  }
  .ant-input {
    // border: 1px solid #000 !important;
  }
  .ant-input:focus {
    box-shadow: none;
    border: 1px solid var(--brand-colors-primary, #116acc);
    background: rgba(11, 44, 58, 0.1);
  }
  .ant-input:hover {
    background: rgba(160, 195, 255, 0.05);
  }
`;

function MTextArea(props) {
  let rules = [];
  if (props.require) {
    rules = commonValidate();
  }
  let maxLength = props.editOrganizationInformation ? null : MAX_LENGTH;
  switch (props.type) {
    case 'email':
      rules = rules.concat(typeValidate('email'));
      break;
    case 'phone':
      rules = rules.concat(phoneValidate());
      break;
    default:
      rules = rules.concat(typeValidate('string'));
      break;
  }
  return (
    <TextAreaWrapper
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
      <Form.Item //
        label={props?.label || ''}
        validateFirst
        name={props?.name || 'MTextArea'}
        hasFeedback
        rules={rules}
        {...props}>
        <TextArea
          className="w-100"
          disabled={props.disabled}
          maxLength={props.maxLength || maxLength}
          rows={props.rows || 2}
          size={props?.size}
          placeholder={props?.placeholder || ''}
          type={props.type || 'string'}
          readOnly={props.readOnly}
        />
      </Form.Item>
    </TextAreaWrapper>
  );
}

export default MTextArea;
