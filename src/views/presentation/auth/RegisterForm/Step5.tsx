import { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import ServiceCheckList from '~/views/container/Settings/Services/ServiceCheckList';

function Step5(props) {
  const { t, i18n } = props;

  useEffect(() => {
    props.setRegisterDes(<div>{t('service_des')}</div>);
  }, [i18n?.language]);

  return (
    <>
      <ServiceCheckList registerForm setStep={props.setStep} setBodyRequest={props.setBodyRequest} />
    </>
  );
}

export default compose(withTranslation())(Step5);
