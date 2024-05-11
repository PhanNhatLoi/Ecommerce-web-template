import { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { authActions } from '~/state/ducks/authUser';
import VehicleCheckList from '~/views/container/Settings/Vehicles/VehicleCheckList';
import AMessage from '~/views/presentation/ui/message/AMessage';

function Registration(props) {
  const { register, t, i18n } = props;

  useEffect(() => {
    props.setRegisterDes(<div>{t('vehicle_des')}</div>);
  }, [i18n?.language]);

  const updateProfile = async (vehicleBrandIds) => {
    if (props.bodyRequest?.profile) {
      const newBody = { ...props.bodyRequest, profile: { ...props.bodyRequest.profile, vehicleBrandIds: vehicleBrandIds } };
      await register(newBody)
        .then(() => {
          AMessage.success(t('register_success'));
          props.setStep(7);
          props.setFormError(null);
        })
        .catch((err) => {
          props.setFormError(t(err.message));
        })
        .finally(() => {
          props.setBodyRequest(null);
        });
    }
  };

  return (
    <>
      <VehicleCheckList registerForm setBodyRequest={props.setBodyRequest} updateProfile={updateProfile} />
    </>
  );
}

export default compose(
  withTranslation(),
  connect(null, {
    register: authActions.register
  })
)(Registration);
