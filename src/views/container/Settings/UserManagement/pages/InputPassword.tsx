import React, { useState } from 'react';
import { Col, Form, Input } from 'antd/es';
import { useTranslation } from 'react-i18next';
import { commonValidate, typeValidate, passwordValidate } from '~/views/utilities/ant-validation';

type Props = {
  isView: boolean;
};
const InputPassword = (props: Props) => {
  const [changePassword, setChangePassword] = useState(false);
  const { t }: any = useTranslation();
  return (
    <>
      <Col sm={24} md={24} lg={11} className="mb-5">
        <Form.Item
          label={t('password').toString()}
          validateFirst
          required={!props.isView}
          name="password"
          rules={commonValidate().concat(typeValidate('string').concat(passwordValidate(6)))}>
          <Input.Password
            disabled={props.isView}
            size="large"
            autoComplete="new-password"
            placeholder={t('password')}
            allowClear
            onChange={() => setChangePassword(true)}
          />
        </Form.Item>
      </Col>
      <Col sm={24} md={24} lg={2} className="mb-5"></Col>
      <Col sm={24} md={24} lg={11} className="mb-5">
        {changePassword && (
          <Form.Item
            label={t('confirm_password').toString()}
            validateFirst
            name="confirm_password"
            rules={[
              ...commonValidate(),
              ({ getFieldValue }) => ({
                validator(_: any, value: string) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('pass_not_match')));
                }
              })
            ]}>
            <Input.Password readOnly={props.isView} size="large" placeholder={t('confirm_password')} allowClear />
          </Form.Item>
        )}
      </Col>
    </>
  );
};

export default InputPassword;
