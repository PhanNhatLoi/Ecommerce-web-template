import React from 'react';
import { Radio, Form, Space } from 'antd/es';
import { commonValidate } from '~/views/utilities/ant-validation';
import styled from 'styled-components';
import COLOR from '~/views/utilities/layout/color';

const MradioStyled = styled.div`
  .ant-radio-disabled+span {
    color : ${COLOR.Black};
  }
  .ant-radio-button-wrapper-disabled.ant-radio-button-wrapper-checked {
    background: ${COLOR.blue};
  }
  .ant-radio-button-wrapper-disabled.ant-radio-button-wrapper {
    color: ${COLOR.Black};
`;
function MRadio(props) {
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  return (
    <MradioStyled
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
      <Form.Item label={props.label || 'MRadio'} name={props.name || 'MRadio'} rules={rules} {...props}>
        <Radio.Group
          value={props.value}
          onChange={props.onChange}
          optionType={props.optionType}
          buttonStyle={props.buttonStyle}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          size={props.size || 'large'}>
          <Space size={props.spaceSize} direction={props.direction}>
            {props.options.map((o) => (
              <Radio value={o.value}>{o.label}</Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </MradioStyled>
  );
}

export default MRadio;
