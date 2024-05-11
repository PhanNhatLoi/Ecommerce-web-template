import { t } from 'i18next';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DeliveryBodyResponse } from '~/state/ducks/carAccessories/deliveryOrders/actions';
import HOC from '~/views/container/HOC';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import InfoForm from '../Forms/InfoForm';
import ViewForm from '../Forms/ViewForm';

export const ViewModal = (props: Props) => {
  const [dirty, setDirty] = useState(false);

  const handleCancel = () => {
    if (dirty) {
      if (window.confirm(t('leave_confirm'))) {
        props.setModalShow(false);
        props.setViewEdit(false);
      } else return;
    } else {
      props.setModalShow(false);
      props.setViewEdit(false);
    }
    setDirty(false);
  };

  return (
    <HOC>
      <AntModal
        title={props.isEditing ? t('delivery_edit') : t('delivery_detail')}
        description={props.isEditing ? t('delivery_edit_des') : t('delivery_detail_des')}
        width={1000}
        destroyOnClose
        supportEdit={!props.isEditing && props.fullAccessPage}
        onEdit={() => props.setViewEdit(true)}
        modalShow={props.modalShow}
        onCancel={handleCancel}>
        {props.isEditing ? <InfoForm data={props?.data} setDirty={setDirty} /> : <ViewForm data={props?.data} />}
      </AntModal>
    </HOC>
  );
};

type Props = {
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  setViewEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  modalShow: boolean;
  data?: DeliveryBodyResponse;
  fullAccessPage: boolean;
};

export default connect(null, {})(ViewModal);
