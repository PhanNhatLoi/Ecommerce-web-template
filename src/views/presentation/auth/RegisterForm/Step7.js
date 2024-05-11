import { Alert, Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { compose } from 'recompose';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { LOGIN_PATH } from '~/configs/routesConfig';
import * as PATH from '~/configs/routesConfig';
import { authActions } from '~/state/ducks/authUser';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import ATypography from '~/views/presentation/ui/text/ATypography';

function Step7(props) {
  const { t, i18n } = props;
  const history = useHistory();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setSubmitting(true);
    setTimeout(() => {
      history.push(PATH.LOGIN_PATH);
      setSubmitting(false);
    }, 500);
  };

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: Step7.js ~ line 27 ~ onFinishFailed ~ err', err);
  };

  useEffect(() => {
    props.setRegisterDes('');
  }, [i18n?.language]);

  return (
    <Form form={form} id="kt_login_signin_form" onFinish={onFinish} onFinishFailed={onFinishFailed}>
      {props.content || (
        <div className="text-justify mb-20">
          {props.registerResult && <Alert message={props.registerResult} type="warning" showIcon closable />}
          <Divider />
          <p>{t('registration_thank_you_note')}</p>
          <p>{t('login_after_activated')}</p>
          <p>
            {t('support_anytime')}{' '}
            <ATypography variant={TYPOGRAPHY_TYPE.LINK} href="https://ecaraid.com/contact-us/" target="_blank">
              {t('contact_us')}
            </ATypography>
          </p>
        </div>
      )}

      <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
        <div style={{ fontSize: '13px' }}>
          {props.backToLoginForm ? (
            <AButton type="link" className="pl-0" onClick={props.backToLoginForm}>
              {t('back_to_login_form')}
            </AButton>
          ) : (
            <>
              <span className="text-dark-50">{t('have_account')}</span>
              <Link to={LOGIN_PATH} className="ml-2" id="kt_login_signup">
                {t('login')}
              </Link>
            </>
          )}
        </div>
      </div>
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
      initOTP: authActions.initOTP
    }
  )
)(Step7);
