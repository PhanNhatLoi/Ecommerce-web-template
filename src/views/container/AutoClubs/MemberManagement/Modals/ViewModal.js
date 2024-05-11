import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SaveOutlined } from '@ant-design/icons';

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
      title={isEditing ? `${t('member_edit')}` : t('member_detail')}
      description={isEditing ? t('member_edit_des') : t('member_detail_des')}
      // supportEdit={!isEditing}
      // onEdit={() => setIsEditing(true)}
      width={1200}
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
        <ViewForm memberUserId={props.memberUserId} id={props.id} onCancel={handleCancel} />
      )}
    </AntModal>
  );
};

export default ViewModal;
