import React from 'react';
import { TimePicker, Form } from 'antd/es';
import { commonValidate } from '~/views/utilities/ant-validation';

function MTimePicker(props) {
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
      <Form.Item label={props.label || 'MTimePicker'} name={props.name || 'MTimePicker'} {...props} rules={rules}>
        <TimePicker size={props.size} className="w-100" onChange={props.onChange} {...props} />
      </Form.Item>
    </div>
  );
}

export default MTimePicker;
