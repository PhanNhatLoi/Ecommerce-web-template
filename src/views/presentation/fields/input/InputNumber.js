import { Form, InputNumber } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';
import COLOR from '~/views/utilities/layout/color';

const ItemWrapStyled = styled.div`
  .ant-form-item-children-icon {
    transform: translateX(-24px);
    -webkit-transform: translateX(-24px);
    -moz-transform: translateX(-24px);
    -ms-transform: translateX(-24px);
    -o-transform: translateX(-24px);
  }
  .ant-input-number-affix-wrapper {
    border-radius: 7px;
  }
  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
  }
  .ant-input-number-group-addon:last-child {
    background-color: white;
    // padding-left: 2px;
    // padding-top: 10px;
  }
  .ant-input-number-input {
    font-size: 12px;
    color: ${COLOR.Black};
    // border-radius: 7px;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

function MInputNumber(props) {
  const { t } = useTranslation();

  return (
    <ItemWrapStyled
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
      {props.copyBtn && props.copyBtn}
      <div title={props?.tooltip?.title || null}>
        <Form.Item
          rules={props.require ? commonValidate() : []}
          label={props?.label || ''}
          validateStatus={props.loading ? 'validating' : undefined}
          validateFirst
          name={props?.name || 'MInputNumber'}
          hasFeedback={props.hasFeedback}
          hidden={props.hidden}
          labelAlign={props.labelAlign}
          labelCol={props.labelCol}
          wrapperCol={props.wrapperCol}
          tooltip={
            props.require && {
              title: t(props.tooltip?.title),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }
          }
          {...props}>
          <InputNumber
            style={{ width: '100%', fontSize: props.fontSize || '12px' }}
            min={props.min || 0}
            allowClear
            disabled={props.disabled}
            max={props.max || Number.MAX_SAFE_INTEGER}
            size={props?.size || 'large'}
            controls={props.controls}
            placeholder={props?.placeholder}
            formatter={props.formatter ? props.formatter : (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={props.parser ? props.parser : (value) => value.replace(/\$\s?|(,*)/g, '')}
            {...props}
          />
        </Form.Item>
      </div>
    </ItemWrapStyled>
  );
}

export default MInputNumber;
