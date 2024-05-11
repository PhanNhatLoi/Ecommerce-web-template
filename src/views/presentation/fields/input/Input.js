import { Form, Input } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { commonValidate, MAX_LENGTH, phoneValidate, typeValidate } from '~/views/utilities/ant-validation';
import COLOR from '~/views/utilities/layout/color';

const InputStyled = styled.div`
  .ant-input[disabled] {
    border-color: #9ca3af;
    color: ${COLOR.Black};
  }
`;

function MInput(props) {
  const { t } = useTranslation();
  const { hasFeedback = true } = props;
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }
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
    <InputStyled
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
      <Form.Item
        label={props?.label || ''}
        validateFirst
        validateStatus={props.loading ? 'validating' : undefined}
        name={props?.name || 'MInput'}
        hasFeedback={hasFeedback}
        labelAlign="left"
        rules={rules.concat(props.mRules || [])}
        tooltip={
          props.tooltip
          // props.require && {
          //   title: t('required_field'),
          //   icon: (
          //     <span>
          //       (<ATypography type="danger">*</ATypography>)
          //     </span>
          //   )
          // }
        }
        {...props}>
        <Input
          autoComplete={props.autoComplete}
          className="w-100"
          maxLength={props.maxLength || MAX_LENGTH}
          size={props?.size || 'large'}
          disabled={props.disabled}
          allowClear={props.allowClear}
          value={props.value}
          onChange={props.onChange}
          readOnly={props.readOnly}
          addonAfter={props.addonAfter}
          placeholder={props?.placeholder || ''}
          type={props.type || 'string'}
          onKeyDown={props.onKeyDown}
          {...props.inputProps}
        />
      </Form.Item>
    </InputStyled>
  );
}

export default MInput;
