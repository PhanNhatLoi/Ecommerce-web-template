import { Checkbox, Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';

function MCheckbox(props) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [rules, setRules] = useState(props.require ? commonValidate() : []);

  useEffect(() => {
    if (props.fetchData) {
      props
        .fetchData(props.params)
        .then((res) => {
          setData(
            res?.content.map((item) => {
              return {
                value: item[props.valueProperty || 'id'],
                label: t(item[props.labelProperty || 'name'])
              };
            })
          );
        })
        .catch((err) => {
          console.error('trandev ~ file: Checkbox.js ~ line 19 ~ useEffect ~ err', err);
        });
    }
  }, []);

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
        label={props.label || ''}
        name={props.name || ''}
        rules={rules}
        tooltip={
          (props.require && {
            title: t('required_field'),
            icon: (
              <span>
                (<ATypography type="danger">*</ATypography>)
              </span>
            )
          }) ||
          props.tooltip
        }>
        <Checkbox.Group //
          onChange={props.onCheckboxChange}
          options={props.options || data || []}
          value={[5] || []}
          style={props.style}
          disabled={props.disabled}></Checkbox.Group>
      </Form.Item>
    </div>
  );
}

export default MCheckbox;
