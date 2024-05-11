import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { SaveOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import InfoForm from '../Forms/InfoForm';

const EditModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={`${t('mechanic_edit')}`}
      description={t('mechanic_edit_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <InfoForm //
        isEditing={true}
        id={props.id}
        setNeedLoadNewData={props.setNeedLoadNewData}
        submitIcon={<SaveOutlined />}
        submitText={t('save')}
        onCancel={handleCancel}
      />
    </AntModal>
  );
};

export default EditModal;
