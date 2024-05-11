import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import ProductServiceList from '../components/ProductServiceList';

type ProductServiceListModalProps = {
  voucher: any;
  setVoucher: any;
  modalShow: boolean;
  setModalShow: (value: boolean) => void;
};

const ProductServiceListModal: React.FC<ProductServiceListModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [productServiceList, setProductServiceList] = useState([]);

  useEffect(() => {
    if (props.voucher && Object.keys(props.voucher).length > 0) {
      setProductServiceList(JSON.parse(props.voucher?.pricingSystemCaches));
    }
  }, [props.voucher]);

  const handleCancel = () => {
    props.setVoucher();
    props.setModalShow(false);
  };

  return (
    <AntModal title={t('voucherDetail')} description={t('')} width={500} destroyOnClose modalShow={props.modalShow} onCancel={handleCancel}>
      <ProductServiceList data={productServiceList} viewOnly={true} />
    </AntModal>
  );
};

export default ProductServiceListModal;
