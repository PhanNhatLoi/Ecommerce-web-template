import { SaveOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_STATUS } from '~/configs/status/notification/notificationStatus';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import InfoForm from '../Forms/InfoForm';
import ViewForm from '../Forms/ViewForm';

const ViewModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [notificationStatus, setNotificationStatus] = useState('');
  const [editing, setEditing] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setEditing(false);
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('notification_detail')}
      description={t('notification_detail_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      supportEdit={notificationStatus === NOTIFICATION_STATUS.WAITING_FOR_APPROVAL && !editing}
      onCancel={handleCancel}
      onEdit={() => setEditing(true)}>
      {editing ? (
        <InfoForm
          isEditing={true}
          id={props.id}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
        />
      ) : (
        <ViewForm id={props.id} onCancel={handleCancel} setNotificationStatus={setNotificationStatus} />
      )}
    </AntModal>
  );
};

export default ViewModal;
