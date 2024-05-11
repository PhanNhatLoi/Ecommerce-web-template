import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { UserAddOutlined } from '@ant-design/icons';
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
      title={t('mechanic_new')}
      description={t('mechanic_new_des')}
      width={1200}
      destroyOnClose
      modalShow={props.modalShow}
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <InfoForm
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        submitIcon={<UserAddOutlined />}
        submitText={t('add')}
      />
    </AntModal>
  );
};

export default AddModal;
