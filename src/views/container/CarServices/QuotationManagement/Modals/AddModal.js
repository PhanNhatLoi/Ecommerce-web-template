import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { SendOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import InfoForm from '../Forms/InfoForm';

const AddModal = (props) => {
  const { t } = useTranslation();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('quotation_new')}
      description={t('quotation_new_des')}
      width={1500}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <InfoForm
        isEditing={false}
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        submitIcon={<SendOutlined />}
        submitText={t('send_quotation')}
      />
    </AntModal>
  );
};

export default AddModal;
