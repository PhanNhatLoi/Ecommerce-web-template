import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import ChatPermissionForm from '../Forms/ChatPermissionForm';

type ChatPermissionModalProps = {
  data: any;
  setData: any;
  modalShow: any;
  setModalShow: any;
  setNeedLoadNewData: any;
};

const ChatPermissionModal: React.FC<ChatPermissionModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [dirty, setDirty] = useState(false);
  const [disableSubmitting, setDisableSubmitting] = useState(false);

  const handleCancel = () => {
    if (dirty)
      if (window.confirm(t('leave_confirm'))) {
        setDirty(false);
        setDisableSubmitting(false);
        props.setModalShow(false);
      } else return;
    else {
      setDirty(false);
      setDisableSubmitting(false);
      props.setModalShow(false);
    }
  };

  const handleOk = () => {
    setDirty(false);
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('chatRole')}
      description={t('')}
      modalShow={props.modalShow}
      width={800}
      destroyOnClose
      onCancel={handleCancel}
      onOk={handleOk}>
      <ChatPermissionForm
        data={props.data}
        disableSubmitting={disableSubmitting}
        setDisableSubmitting={setDisableSubmitting}
        setNeedLoadNewData={props.setNeedLoadNewData}
        setDirty={setDirty}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </AntModal>
  );
};

export default ChatPermissionModal;
