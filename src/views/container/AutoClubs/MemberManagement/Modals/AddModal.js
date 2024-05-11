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
      description={t('member_new_des')}
      hasSubmit
      modalShow={props.modalShow}
      destroyOnClose
      onCancel={handleCancel}
      submitDisabled={false}
      title={t('member_new')}
      width={1400}>
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
