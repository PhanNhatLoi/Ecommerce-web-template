import { SaveOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// configs
import AntModal from '~/views/presentation/ui/modal/AntModal';
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
      title={isEditing ? t('supplier_edit') : t('supplier_detail')}
      description={isEditing ? t('supplier_edit_des') : t('supplier_detail_des')}
      width={1200}
      supportEdit={!isEditing && props.fullAccessPage}
      onEdit={() => setIsEditing(true)}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      {isEditing ? (
        <InfoForm //
          isEditing={isEditing}
          id={props.id}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('update_supplier')}
          onCancel={handleCancel}
        />
      ) : (
        <InfoForm //
          isEditing={isEditing}
          id={props.id}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
        />
      )}
    </AntModal>
  );
};

export default ViewModal;
