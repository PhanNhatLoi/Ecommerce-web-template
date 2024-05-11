import { DatePicker, Form } from 'antd/es';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';
import { UtilDate } from '~/views/utilities/helpers';
import COLOR from '~/views/utilities/layout/color';

const DatePickerStyled = styled.div`
  .ant-picker-input > input[disabled] {
    color: ${COLOR.Black};
  }
`;
function disabledDate(current) {
  // Can not select days before today
  return current && current < moment().subtract(1, 'day').endOf('day');
}

function MDatePicker(props) {
  const { t } = useTranslation();
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  return (
    <DatePickerStyled
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
        labelAlign="left"
        label={props.label || ''}
        name={props.name || 'MDatePicker'}
        rules={rules}
        hasFeedback
        tooltip={
          props.tooltip ||
          (props.require && {
            title: t('required_field'),
            icon: (
              <span>
                (<ATypography type="danger">*</ATypography>)
              </span>
            )
          })
        }
        {...props}>
        {/* https://ant.design/components/date-picker/#API */}
        <DatePicker
          className="w-100"
          showTime={props.showTime}
          format={props.format ? props.format : UtilDate.formatDateLocal}
          showNow={props.showNow}
          size="large"
          disabledDate={props.disabledDate ? props.disabledDate : disabledDate}
          picker={props.picker}
          onChange={props.onChange}
          style={{ height: '40px' }}
          {...props}
        />
      </Form.Item>
    </DatePickerStyled>
  );
}

export default MDatePicker;
