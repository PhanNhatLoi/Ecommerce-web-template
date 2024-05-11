import { DatePicker, Form } from 'antd/es';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';
import { UtilDate } from '~/views/utilities/helpers';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';
import styled from 'styled-components';
import COLOR from '~/views/utilities/layout/color';

const { RangePicker } = DatePicker;

const RangePickerStyled = styled(RangePicker)`
  height: 40px;

  .ant-picker-input > input[disabled] {
    color: ${COLOR.Black};
  }
`;

function disabledDate(current) {
  // Can not select days before today
  return current && current < moment().subtract(1, 'day').endOf('day');
}

function MRangePicker(props) {
  const { t } = useTranslation();
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }
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
      <Form.Item
        label={props.label || 'MRangePicker'}
        name={props.name || 'MRangePicker'}
        rules={rules}
        tooltip={
          props.require && {
            title: t('required_field'),
            icon: (
              <span>
                (<ATypography type="danger">*</ATypography>)
              </span>
            )
          }
        }
        {...props}>
        <RangePickerStyled
          disabled={props.disabled}
          format={props.showTime ? UtilDate.formatDateTimeLocal : UtilDate.formatDateLocal}
          className="w-100"
          size={'large'}
          disabledDate={props.disabledDate || disabledDate}
          defaultValue={props.defaultValue}
          allowClear={props.allowClear}
          onChange={props.onChange}
          suffixIcon={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Calendar.svg')} />}
          {...props}
        />
      </Form.Item>
    </div>
  );
}

export default MRangePicker;
