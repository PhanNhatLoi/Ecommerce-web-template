import { Form, InputNumber, Select } from 'antd/es';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TIME_UNITS } from '~/configs';
import { appDataActions } from '~/state/ducks/appData';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';

const InputNumberStyled = styled(InputNumber)`
  padding-left: 0;
  border: 0;
  border-bottom: 1px solid #000;

  &:hover {
    border-bottom: 1px solid #40a9ff;
  }

  &.ant-input-number-affix-wrapper-focused {
    border-bottom: 1px solid #40a9ff;
  }

  .ant-input-number-input-wrap .ant-input-number-input {
    padding: 0 11px;
  }
`;

function MInputTime(props) {
  const { t } = useTranslation();

  return (
    <>
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
        {props.copyBtn || props.copyBtn}
        <Form.Item //
          label={props?.label || ''}
          validateFirst
          rules={props.require ? commonValidate() : []}
          name={props?.name || 'MInputTime'}
          tooltip={
            props?.require && {
              title: t('required_field'),
              icon: (
                <span>
                  (<ATypography type="danger">*</ATypography>)
                </span>
              )
            }
          }
          {...props}>
          <div className="w-100 d-flex">
            <Form.Item
              name="timeNumber"
              hasFeedback={props.hasFeedback}
              style={{ width: '60%', transform: `translateY(${props.timeTextTranslate || '2.5px'})` }}>
              <InputNumberStyled
                className="w-100"
                allowClear
                min={props.min || 0}
                max={props.max || Number.MAX_SAFE_INTEGER}
                size={props?.size || 'large'}
                bordered={false}
                controls={false}
                placeholder={props?.placeholder || ''}
                readOnly={props.readOnly}
                formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item name="time" hasFeedback={props.hasFeedback} style={{ width: '40%' }}>
              <Select
                showSearch
                disabled={props.disabled}
                defaultValue={props.defaultValue}
                size={props?.size || 'large'}
                placeholder={t('select_time')}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {Object.keys(TIME_UNITS).map((c) => (
                  <Select.Option value={TIME_UNITS[c]}>{t(c)}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form.Item>
      </div>
    </>
  );
}

export default connect(
  (state) => ({
    countries: state['appData']?.countries
  }),
  {
    getListCountry: appDataActions.getListCountry
  }
)(MInputTime);
