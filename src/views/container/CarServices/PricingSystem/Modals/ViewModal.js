import { SaveOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import InfoForm from '../Forms/InfoForm';
import ViewForm from '../Forms/ViewForm';

const ViewModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
  };

  const handleOk = () => {
    form.resetFields();
    setDirty(false);
    setIsEditing(false);
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={isEditing ? t('pricing_product_edit') : t('pricing_product_detail')}
      description={isEditing ? t('pricing_product_edit_des') : t('pricing_product_detail_des')}
      width={1200}
      supportEdit={!isEditing}
      onEdit={() => setIsEditing(true)}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}>
      {isEditing ? (
        <InfoForm //
          isEditing={true}
          setIsEditing={setIsEditing}
          id={props.id}
          form={form}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
          onOk={handleOk}
          setDirty={setDirty}
        />
      ) : (
        <ViewForm id={props.id} onCancel={handleCancel} />
      )}
    </AntModal>
  );
};

export default ViewModal;
