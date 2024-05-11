import { PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import InfoForm from '../Forms/InfoForm';

const AddModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);

  const handleCancel = () => {
    if (dirty)
      if (window.confirm(t('leave_confirm'))) {
        form.resetFields();
        setDirty(false);
        props.setModalShow(false);
      } else return;
    else {
      form.resetFields();
      setDirty(false);
      props.setModalShow(false);
    }
  };

  const handleOk = () => {
    form.resetFields();
    setDirty(false);
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('pricing_system_new')}
      description={t('pricing_system_new_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      onOk={handleOk}
      hasSubmit>
      <InfoForm
        isEditing={true}
        form={form}
        isModal
        isCreate
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        onOk={handleOk}
        setDirty={setDirty}
        submitIcon={<PlusOutlined />}
        submitText={t('create_product/service')}
      />
    </AntModal>
  );
};

export default AddModal;
