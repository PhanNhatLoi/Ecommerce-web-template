import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import InfoForm from '../Forms/InfoForm';

const AddModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('request_new')}
      description={t('request_new_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <InfoForm //
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        submitIcon={<PlusOutlined />}
        submitText={t('create')}
      />
    </AntModal>
  );
};

export default AddModal;
