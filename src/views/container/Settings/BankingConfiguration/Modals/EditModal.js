import { SaveOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import InfoForm from '../Forms/InfoForm';

const EditModal = (props) => {
  const { t } = useTranslation();
  const [dirty, setDirty] = useState(false);

  const handleCancel = () => {
    // form.resetFields();
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
      title={`${t('bank_account_edit')} ${props.id}`}
      description={t('bank_accounta_edit_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      onOk={handleOk}
      hasSubmit>
      <InfoForm //
        isEditing={true}
        id={props.id}
        modalShow={props.modalShow}
        setNeedLoadNewData={props.setNeedLoadNewData}
        submitIcon={<SaveOutlined />}
        submitText={t('save')}
        onCancel={handleCancel}
        onOk={handleOk}
        setDirty={setDirty}
      />
    </AntModal>
  );
};

export default EditModal;
