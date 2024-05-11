import { Form, Input, Select } from 'antd/es';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { head } from 'lodash-es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { appDataActions } from '~/state/ducks/appData';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate, MAX_LENGTH } from '~/views/utilities/ant-validation';
import COLOR from '~/views/utilities/layout/color';

const InputStyled = styled.div`
  .ant-input-group-addon {
    border: none;
    background: none;
  }
  .ant-input[disabled] {
    border-color: #9ca3af;
    color: ${COLOR.Black};
  }
  .ant-select-selection-item {
    color: ${COLOR.Black};
  }
`;

function MInputPhone(props) {
  const { t } = useTranslation();
  const [rules, setRules] = useState(props?.require ? commonValidate() : []);

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
      <Form.Item //
        label={props?.label || ''}
        validateFirst
        name={props.listName ? [props.itemIndex, props.name] : props?.name || ''}
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
          <Form.Item name={props.listName ? [props.itemIndex, 'code'] : 'code'} style={{ width: '30%', marginRight: '2px' }}>
            <Select //
              showSearch
              disabled={props.disabled}
              size={props?.size || 'large'}
              placeholder={t('country_code')}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {(props.countries || []).map((c) => (
                <Select.Option value={props.countryPhone ? c.phone : c.id}>{`${c.code} +${c.phone}`}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={props.listName ? [props.itemIndex, 'phone'] : 'phone'}
            hasFeedback={props.hasFeedback}
            rules={rules.concat([
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  const codeSelected = props.listName ? getFieldValue([props.listName, props.itemIndex, 'code']) : getFieldValue('code');
                  const countryCode = head(props.countries.filter((c) => (props.countryPhone ? c.phone : c.id === codeSelected))).code;
                  if (isValidPhoneNumber(value, countryCode)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('phone_invalid')));
                }
              })
            ])}
            style={{ width: '70%' }}>
            <Input
              allowClear
              disabled={props.disabled}
              readOnly={props.readOnly}
              maxLength={MAX_LENGTH}
              size={props?.size || 'large'}
              placeholder={props?.placeholder || ''}
              type={props.type || 'string'}
            />
          </Form.Item>
        </div>
      </Form.Item>
    </InputStyled>
  );
}

export default connect(
  (state) => ({
    countries: state['appData']?.countries
  }),
  {
    getListCountry: appDataActions.getListCountry
  }
)(MInputPhone);
