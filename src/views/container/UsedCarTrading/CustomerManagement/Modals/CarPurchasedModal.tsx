import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HOC from '~/views/container/HOC';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import CarPurchasedTable from '../components/CarPurchasedTable';

type RevaluationModalProps = {
  modalShow: boolean;
  setModalShow: any;
  getUsedCarTradingCustomer: any;
  getRoleBase: any;
};

export const RevaluationModal: React.FC<RevaluationModalProps> = (props) => {
  const { t }: any = useTranslation();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('revaluation')}
        description={''}
        width={1000}
        destroyOnClose
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onCancel={handleCancel}>
        <CarPurchasedTable />
      </AntModal>
    </HOC>
  );
};

export default RevaluationModal;
