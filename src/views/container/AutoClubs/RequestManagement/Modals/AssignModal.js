import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { UserAddOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import AssignForm from '../Forms/AssignForm';

const AssignModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('assign_request')}
      description={t('assign_request_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <AssignForm //
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        submitIcon={<UserAddOutlined />}
        submitText={t('add')}
      />
    </AntModal>
  );
};

export default AssignModal;
