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
        setDirty(false);
        props.setModalShow(false);
      } else return;
    else {
      setDirty(false);
      props.setModalShow(false);
    }
  };

  const handleOk = () => {
    setDirty(false);
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('bank_account_new')}
      description={t('bank_account_new_des')}
      width={500}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      onOk={handleOk}
      hasSubmit>
      <InfoForm //
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        onOk={handleOk}
        submitIcon={<PlusOutlined />}
        submitText={t('add')}
        setDirty={setDirty}
      />
    </AntModal>
  );
};

export default AddModal;
