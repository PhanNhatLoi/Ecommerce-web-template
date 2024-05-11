import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { SaveOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';

import AntModal from '~/views/presentation/ui/modal/AntModal';
import SpecificationViewForm from '../Forms/specificationViewForm';
import SpecificationInfoForm from '../Forms/specificationInfoForm';

const ViewSpecificationModal = (props) => {
  const { t }: any = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = (dirty = false) => {
    if (dirty && isEditing) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm(t('leave_confirm'))) {
        props.setModalShow(false);
        form.resetFields();
        setIsEditing(false);
      }
    } else {
      props.setModalShow(false);
      form.resetFields();
    }
    setIsEditing(false);
  };

  const onFinish = () => {};

  return (
    <AntModal
      title={isEditing ? t('specification_edit') : t('specification_detail')}
      description={isEditing ? t('specification_edit_des') : t('specification_detail_des')}
      width={1200}
      supportEdit={!isEditing}
      onEdit={() => setIsEditing(true)}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      {isEditing ? (
        <SpecificationInfoForm //
          isEditing={true}
          setIsEditing={setIsEditing}
          id={props.id}
          form={form}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
        />
      ) : (
        <SpecificationViewForm id={props.id} onCancel={handleCancel} />
      )}
    </AntModal>
  );
};

export default ViewSpecificationModal;
