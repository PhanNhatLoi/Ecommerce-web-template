import { Form } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import InfoForm from '../Forms/InfoForm';
import ViewForm from '../Forms/ViewForm';

const ViewModal = (props) => {
  const { t }: any = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

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
      title={isEditing ? t('item_edit') : t('items_detail')}
      description={isEditing ? t('item_edit_des') : t('item_detail_des')}
      width={1400}
      supportEdit={!isEditing}
      onEdit={() => {
        setIsEditing(true);
        history.push(`${PATH.CAR_ACCESSORIES_ITEMS_EDIT_PATH}?id=${props.id}`);
      }}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      {isEditing ? (
        <InfoForm //
          isEditing={true}
          setIsEditing={setIsEditing}
          form={form}
          // setNeedLoadNewData={props.setNeedLoadNewData}
          // onCancel={handleCancel}
        />
      ) : (
        <ViewForm onCancel={handleCancel} />
      )}
    </AntModal>
  );
};

export default ViewModal;
