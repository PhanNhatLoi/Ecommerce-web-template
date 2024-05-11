import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { UserAddOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import InfoForm from '../Forms/InfoForm';

const AddModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);

  const handleCancel = () => {
    if (dirty) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm(t('leave_confirm'))) {
        form.resetFields();
        props.setModalShow(false);
      }
    } else {
      form.resetFields();
      props.setModalShow(false);
    }
  };

  return (
    <AntModal
      title={t('mechanic_new')}
      description={t('mechanic_new_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <InfoForm //
        isModal
        form={form}
        setDirty={setDirty}
        dirty={dirty}
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        submitIcon={<UserAddOutlined />}
        submitText={t('add')}
      />
    </AntModal>
  );
};

export default AddModal;
