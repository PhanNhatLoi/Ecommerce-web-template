import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { UserAddOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import InfoForm from '../Forms/InfoForm';

const AddModal = (props) => {
  const { t } = useTranslation();
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
      title={t('customer_new')}
      description={t('customer_new_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <InfoForm
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        onOk={handleOk}
        setDirty={setDirty}
        submitIcon={<UserAddOutlined />}
        submitText={t('add')}
      />
    </AntModal>
  );
};

export default AddModal;
