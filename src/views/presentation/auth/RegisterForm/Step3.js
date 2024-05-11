import { Form, Input } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import COLOR from '~/color';
import { LOGIN_PATH } from '~/configs/routesConfig';
import { authActions } from '~/state/ducks/authUser';
import AButton from '~/views/presentation/ui/buttons/AButton';
import { commonValidate, max, min, typeValidate, whiteSpaceValidate } from '~/views/utilities/ant-validation';

function Step3(props) {
  const { t, i18n } = props;
  const [isSubmitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setSubmitting(true);
    props.setStep(4);
    props.setPassword(values.password);
    setSubmitting(false);
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: Step3.js ~ line 31 ~ onFinishFailed ~ err', err);
  };

  useEffect(() => {
    props.setRegisterDes('');
  }, [i18n?.language]);

  return (
    <Form
      form={form}
      name="kt_register_form"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onChange={() => setDisableSubmit(!form.getFieldValue('password') || !form.getFieldValue('rePassword'))}>
      {/* begin: Password */}
      <span className="text-title">{t('password')}</span>
      <Form.Item
        validateFirst
        name="password"
        hasFeedback
        rules={commonValidate().concat(whiteSpaceValidate(), typeValidate('string'), min(6, t('min_6_syms')), max(20, t('max_20_syms')))}>
        <Input.Password allowClear size="large" placeholder={t('password')} name="password" style={{ backgroundColor: 'transparent' }} />
      </Form.Item>
      {/* end: Password */}

      {/* begin: Confirm Password */}
      <span className="text-title">{t('confirm_pass')}</span>
      <Form.Item
        validateFirst
        name="rePassword"
        hasFeedback
        rules={commonValidate().concat(({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error(t('pass_not_match')));
          }
        }))}>
        <Input.Password
          allowClear
          size="large"
          placeholder={t('confirm_pass')}
          name="rePassword"
          style={{ backgroundColor: 'transparent' }}
        />
      </Form.Item>
      {/* end: Confirm Password */}

      <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
        <div style={{ fontSize: '13px' }}>
          <span className="text-dark-50">{t('have_account')}</span>
          <Link to={LOGIN_PATH} className="ml-2" id="kt_login_signup" style={{ color: COLOR['primary-color'] }}>
            {t('login')}
          </Link>
        </div>
      </div>
      <AButton
        id="kt_login_signin_submit"
        type="primary"
        size="large"
        style={{ borderRadius: '8px' }}
        disabled={disableSubmit}
        loading={isSubmitting}
        block
        htmlType="submit">
        {t('next')}
      </AButton>
    </Form>
  );
}

export default compose(
  withTranslation(),
  connect(
    (state) => ({
      country: state['appData'].country
    }),
    {
      checkEmail: authActions.checkEmail,
      initOTP: authActions.initOTP,
      confirmOTP: authActions.confirmOTP,
      register: authActions.register,
      getVendorType: authActions.getVendorType,
      getNumberOfMember: authActions.getNumberOfMember
    }
  )
)(Step3);
