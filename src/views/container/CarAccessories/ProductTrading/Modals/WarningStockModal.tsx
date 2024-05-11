import { CloseOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { tradingProductActions } from '~/state/ducks/carAccessories/ProductTrading';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AntModal from '~/views/presentation/ui/modal/AntModal';

type WarningModalProps = {
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
};

export const WarningModal: React.FC<WarningModalProps> = (props) => {
  const { t }: any = useTranslation();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('warningModalTitle')}
        description={''}
        width={600}
        destroyOnClose
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onCancel={handleCancel}>
        {
          <div>
            <span>
              {`${t('warningStock1')} (`}
              <strong>{`${props?.data?.stockQuantity} ${t('products_lower_case')}`}</strong>
              {`) ${t('warningStock2')} (`}
              <strong>{`${props?.data?.lowStockThreshold} ${t('products_lower_case')}`}</strong>
              {`). ${t('warningStock3')}`}
            </span>
            <Divider />
            <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
              <AButton
                style={{ verticalAlign: 'middle', width: '200px' }}
                className="mt-3 mt-lg-0 ml-lg-3 px-5"
                size="large"
                type="ghost"
                onClick={handleCancel}
                icon={<CloseOutlined />}>
                {t('close')}
              </AButton>
            </div>
          </div>
        }
      </AntModal>
    </HOC>
  );
};

export default connect(null, {
  createTradingProduct: tradingProductActions.createTradingProduct,
  updateTradingProduct: tradingProductActions.updateTradingProduct
})(WarningModal);
