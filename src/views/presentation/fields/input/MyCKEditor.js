import { Form } from 'antd/es';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';

import MyCKEditor from '../../ui/editor/MyCKEditor';

function MCKEditor(props) {
  const { t } = useTranslation();
  const [rules, setRules] = useState(props.require ? commonValidate() : []);
  const [data, setData] = useState('');

  const onChangeEditor = (event, editor) => {
    setData(editor.getData());
    props.onChange(editor.getData());
  };

  useEffect(() => {
    setData(props.value);
  }, [props.value]);

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
        {props.copyBtn && props.copyBtn}
        <Form.Item
          validateStatus={props.loading ? 'validating' : undefined}
          label={props?.label}
          name={props.name || 'MCKEditor'}
          rules={rules.concat(props.mRules || [])}
          extra={props.extra}
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
          <MyCKEditor
            name="content"
            data={props.value || data || ''}
            disabled={props.disabled}
            onChange={onChangeEditor}
            toolBar={props.toolBar}></MyCKEditor>
        </Form.Item>
      </div>
    </>
  );
}
export default MCKEditor;
