import React, { useEffect, useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import AntModal from '~/views/presentation/ui/modal/AntModal';
import InfoForm from '../Forms/InfoForm';
import ViewForm from '../Forms/ViewForm';
import { mechanicActions } from '~/state/ducks/mechanic';
import { requestActions } from '~/state/ducks/request';

const ViewModal = (props) => {
  const { t } = useTranslation();
  const [dirty, setDirty] = useState(false);

  const handleCancel = () => {
    if (dirty)
      if (window.confirm(t('leave_confirm'))) {
        setDirty(false);
        props.setIsEditModal(false);
        props.setModalShow(false);
      } else return;
    else {
      setDirty(false);
      props.setIsEditModal(false);
      props.setModalShow(false);
    }
  };

  const handleOk = () => {
    setDirty(false);
    props.setIsEditModal(false);
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={props.isEditModal ? `${t('customer_edit')}` : t('customer_detail')}
      description={props.isEditModal ? t('customer_edit_des') : t('customer_detail_des')}
      width={1200}
      supportEdit={!props.isEditModal}
      destroyOnClose
      onEdit={() => props.setIsEditModal(true)}
      modalShow={props.modalShow}
      onOk={handleOk}
      onCancel={handleCancel}>
      {props.isEditModal ? (
        <InfoForm //
          isEditing={true}
          id={props.id}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
          onOk={handleOk}
          setDirty={setDirty}
        />
      ) : (
        <ViewForm //
          customerOrderId={props.customerOrderId}
          id={props.id}
          onCancel={handleCancel}
        />
      )}
    </AntModal>
  );
};

export default connect(null, {
  getMechanicDetail: mechanicActions.getMechanicDetail,
  getMechanics: mechanicActions.getMechanics,
  getRequests: requestActions.getRequests
})(ViewModal);
