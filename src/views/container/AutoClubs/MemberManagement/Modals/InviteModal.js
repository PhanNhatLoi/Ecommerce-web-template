import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { mechanicActions } from '~/state/ducks/mechanic';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import InviteForm from '../Forms/InviteForm';

const InviteModal = (props) => {
  const { t } = useTranslation();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <AntModal //
      description={t('invite_member_des')}
      modalShow={props.modalShow}
      onCancel={handleCancel}
      destroyOnClose
      title={t('invite_member')}
      width={1000}>
      <InviteForm handleCancel={handleCancel} />
    </AntModal>
  );
};

export default connect(null, {
  deleteMechanic: mechanicActions.deleteMechanic,
  approveMechanic: mechanicActions.approveMechanic,
  blockMechanic: mechanicActions.blockMechanic,
  rejectMechanic: mechanicActions.rejectMechanic
})(InviteModal);
