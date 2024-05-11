import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { SaveOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import InfoForm from '../Forms/InfoForm';

const EditModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);

  const handleCancel = () => {
    if (dirty) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm(t('leave_confirm'))) {
        props.setModalShow(false);
        form.resetFields();
      }
    } else {
      props.setModalShow(false);
      form.resetFields();
    }
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
        isModal
        form={form}
        isEditing={true}
        id={props.id}
        setDirty={setDirty}
        dirty={dirty}
        setNeedLoadNewData={props.setNeedLoadNewData}
        submitIcon={<SaveOutlined />}
        submitText={t('save')}
        onCancel={handleCancel}
      />
    </AntModal>
  );
};

export default EditModal;
