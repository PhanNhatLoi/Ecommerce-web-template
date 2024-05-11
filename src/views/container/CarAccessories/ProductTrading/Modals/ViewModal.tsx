import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as ROUTES from '~/configs/routesConfig';
import HOC from '~/views/container/HOC';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import { isVendor } from '~/configs/status/settings/roleBaseStatus';

import ViewForm from '../Forms/ViewForm';

export const ViewModal = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('trading_product_detail')}
        description={t('trading_product_des')}
        width={800}
        destroyOnClose
        onEdit={() => {
          history.push(`${ROUTES.CAR_ACCESSORIES_UPDATE_PRODUCT_TRADING}?id=${props.data?.id}`);
        }}
        supportEdit={props.fullAccessPage}
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onCancel={handleCancel}>
        <ViewForm //
          onCancel={handleCancel}
          data={props.data}
        />
      </AntModal>
    </HOC>
  );
};

export default ViewModal;
