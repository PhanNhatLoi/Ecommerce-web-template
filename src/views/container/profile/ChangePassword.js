import { Alert, Form, Input } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { authActions } from '~/state/ducks/authUser';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { commonValidate, max, min, typeValidate, whiteSpaceValidate } from '~/views/utilities/ant-validation';

function ChangePassword(props) {
  const { t } = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [formError, setFormError] = useState(null);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const body = { ...values };
    props
      .changePassword(body)
      .then((res) => {
        AMessage.success(t('change_password_success'));
        setFormError(null);
      })
      .catch((err) => {
        setSubmitting(false);
        setFormError(t('wrong_old_password'));
      });
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: Step3.js ~ line 31 ~ onFinishFailed ~ err', err);
  };

  return (
    <Form
      form={form}
      name="kt_register_form"
      onFinish={onFinish}
      className="card card-custom"
      onFinishFailed={onFinishFailed}
      onChange={() =>
        setDisableSubmit(!form.getFieldValue('currentPassword') || !form.getFieldValue('newPassword') || !form.getFieldValue('rePassword'))
      }>
      {/* begin::Header */}
      <div className="card-header py-3">
        <div className="card-title align-items-start flex-column">
          <h3 className="card-label font-weight-bolder text-dark">{t('change_password')}</h3>
          <span className="text-muted font-weight-bold font-size-sm mt-1">{t('change_your_pass')}</span>
        </div>
        <div className="card-toolbar">
          <AButton type="primary" htmlType="submit" loading={isSubmitting} disabled={disableSubmit}>
            {t('save_changes')}
          </AButton>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Form */}
      <div className="form">
        <div className="card-body">
          {/* begin::Alert */}
          {formError && (
            <div className="mb-10">
              <Alert message={formError} type="error" showIcon />
            </div>
          )}
          {/* end::Alert */}

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">{t('current_pass')}</label>
            <div className="col-lg-9 col-xl-6">
              <Form.Item validateFirst name="currentPassword" hasFeedback rules={commonValidate()}>
                <Input.Password allowClear size="large" placeholder={t('current_pass')} />
              </Form.Item>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">{t('new_pass')}</label>
            <div className="col-lg-9 col-xl-6">
              <Form.Item
                validateFirst
                name="newPassword"
                hasFeedback
                rules={commonValidate().concat(
                  whiteSpaceValidate(),
                  typeValidate('string'),
                  min(6, t('min_6_syms')),
                  max(20, t('max_20_syms'))
                )}>
                <Input.Password allowClear size="large" placeholder={t('new_pass')} />
              </Form.Item>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-xl-3 col-lg-3 col-form-label text-alert">{t('verify_pass')}</label>
            <div className="col-lg-9 col-xl-6">
              <Form.Item
                validateFirst
                name="rePassword"
                hasFeedback
                rules={commonValidate().concat(({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('pass_not_match')));
                  }
                }))}>
                <Input.Password allowClear size="large" placeholder={t('confirm_pass')} name="rePassword" />
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
      {/* end::Form */}
    </Form>
  );
}

export default connect(null, {
  changePassword: authActions.changePassword
})(ChangePassword);
