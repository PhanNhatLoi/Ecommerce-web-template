import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { tradingProductActions } from '~/state/ducks/carAccessories/ProductTrading';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type WarningPriceModalProps = {
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatePage: () => Boolean;
  handleSubmitForm: (action: any, body: any, msg: String) => void;
  body: any;
  inStockPrice: any;
  createTradingProduct: any;
  updateTradingProduct: any;
};

export const WarningPriceModal: React.FC<WarningPriceModalProps> = (props) => {
  const { t }: any = useTranslation();

  const handleOk = () => {
    props.isUpdatePage()
      ? props.handleSubmitForm(props.updateTradingProduct, props.body, 'Update Success')
      : props.handleSubmitForm(props.createTradingProduct, props.body, 'Create Success');
  };

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('warningModalTitle')}
        description={''}
        width={800}
        destroyOnClose
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onOk={handleOk}
        onCancel={handleCancel}>
        {
          <div>
            <span>
              {`${t('warningCreateGood1')} (`}
              <strong>{numberFormatDecimal(props.inStockPrice, ' đ', '')}</strong>
              {`), ${t('warningCreateGood2')}`}
            </span>
            <Divider />
            <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
              <AButton
                style={{ verticalAlign: 'middle', minWidth: '200px' }}
                className="px-5"
                size="large"
                onClick={handleOk}
                type="primary"
                icon={<SaveOutlined />}>
                {t('save')}
              </AButton>

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
})(WarningPriceModal);
