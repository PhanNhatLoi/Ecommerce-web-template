import React from 'react';
import { useTranslation } from 'react-i18next';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ViewForm from '../Forms/ViewForm';

const ViewModal = (props) => {
  const { t } = useTranslation();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  const onFinish = () => {};

  return (
    <AntModal
      title={t('help_detail')}
      description={t('help_detail_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      <ViewForm id={props.id} onCancel={handleCancel} />
    </AntModal>
  );
};

export default ViewModal;
