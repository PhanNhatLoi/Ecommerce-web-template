import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import { ViewCustomerIdType } from '../components/Types';
import ViewForm from '../Forms/ViewForm';

type ViewModalProps = {
  id?: ViewCustomerIdType;
  modalShow: boolean;
  setModalShow: (value: boolean) => void;
  fullAccessPage: boolean;
};

const ViewModal: React.FC<ViewModalProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  const onFinish = () => {};

  return (
    <AntModal
      title={t('customer_detail')}
      description={t('customer_detail_des')}
      width={1200}
      supportEdit={props.fullAccessPage}
      destroyOnClose
      onEdit={() =>
        history.push(PATH.CAR_ACCESSORIES_CUSTOMER_EDIT_PATH.replace(':code/:profileId', `${props.id?.code}/${props.id?.profileId}`))
      }
      modalShow={props.modalShow}
      onOk={onFinish}
      onCancel={handleCancel}>
      <ViewForm //
        id={props.id?.profileId}
        onCancel={handleCancel}
      />
    </AntModal>
  );
};

export default ViewModal;
