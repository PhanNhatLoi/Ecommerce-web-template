import React, { useState } from 'react';
import { connect } from 'react-redux';
import { mechanicActions } from '~/state/ducks/mechanic';
import { requestActions } from '~/state/ducks/request';
import { useTranslation } from 'react-i18next';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ViewForm from '../Forms/ViewForm';
import InfoForm from '../Forms/InfoForm';

const ViewModal = (props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    props.setModalShow(false);
    setIsEditing(false);
  };

  const onFinish = () => {};

  return (
    <AntModal
      title={t('repair_detail')}
      description={t('repair_detail_des')}
      width={1200}
      // supportEdit={!isEditing}
      // onEdit={() => setIsEditing(true)}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      {isEditing ? (
        <InfoForm //
          isEditing={true}
          id={props.id}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
        />
      ) : (
        <ViewForm id={props.id} onCancel={handleCancel} />
      )}
    </AntModal>
  );
};

export default connect(null, {
  getMechanicDetail: mechanicActions.getMechanicDetail,
  getMechanics: mechanicActions.getMechanics,
  getRequests: requestActions.getRequests
})(ViewModal);
