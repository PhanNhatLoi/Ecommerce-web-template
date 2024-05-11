import React, { useState } from 'react';
import { connect } from 'react-redux';
import { mechanicActions } from '~/state/ducks/mechanic';
import { requestActions } from '~/state/ducks/request';
import { useTranslation } from 'react-i18next';
import { SaveOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';

import AntModal from '~/views/presentation/ui/modal/AntModal';
import ViewForm from '../Forms/ViewForm';
import InfoForm from '../Forms/InfoForm';

const ViewModal = (props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);

  const handleCancel = () => {
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

  return (
    <AntModal
      title={isEditing ? `${t('employee_edit')}` : t('employee_detail')}
      description={isEditing ? t('employee_edit_des') : t('employee_detail_des')}
      width={1200}
      supportEdit={!isEditing && props.isActiveMember}
      onEdit={() => setIsEditing(true)}
      modalShow={props.modalShow}
      destroyOnClose
      onCancel={handleCancel}>
      {isEditing ? (
        <InfoForm //
          isEditing={true}
          setIsEditing={setIsEditing}
          id={props.id}
          form={form}
          setDirty={setDirty}
          dirty={dirty}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
        />
      ) : (
        <ViewForm id={props.id} onCancel={handleCancel} />
      )}
    </AntModal>
  );
};

export default connect(null, {
  getMechanicDetail: mechanicActions.getMechanicDetail,
  getMechanics: mechanicActions.getMechanics,
  getRequests: requestActions.getRequests
})(ViewModal);
