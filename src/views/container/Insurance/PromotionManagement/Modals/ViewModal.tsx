import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { PROMOTION_STATUS } from '~/configs/status/car-accessories/promotionStatus';
import { INSURANCE_PROMOTION_TYPE } from '~/configs/type/promotionType';
import { promotionActions } from '~/state/ducks/insurance/promotion';
import HOC from '~/views/container/HOC';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import ViewFormPromotion from '../Forms/ViewForm';

export const PromotionViewModal = (props: {
  id?: number;
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  fullAccessPage: boolean;
  getPromotionDetail: any;
}) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [promotionDetail, setPromotionDetail] = useState<any>();

  useEffect(() => {
    if (props.id) {
      props
        .getPromotionDetail(props.id)
        .then((res) => {
          setPromotionDetail(res?.content);
        })
        .catch((err) => console.error(err));
    }
  }, [props.id]);

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('promotion_detail')}
        description={t('promotion_detail_des')}
        width={1000}
        destroyOnClose
        supportEdit={
          props.fullAccessPage &&
          moment().isBefore(promotionDetail?.endDate) &&
          !promotionDetail.quantityUsed &&
          [(PROMOTION_STATUS.ACTIVATED, PROMOTION_STATUS.WAITING_FOR_APPROVAL)].includes(promotionDetail?.status)
        }
        onEdit={() => {
          history.push(
            (promotionDetail?.promotionType === INSURANCE_PROMOTION_TYPE.INSURANCE_PACKAGE_DISCOUNT
              ? PATH.INSURANCE_DISCOUNT_EDIT_PATH
              : PATH.INSURANCE_COUPON_EDIT_PATH
            ).replace(':id', promotionDetail?.id)
          );
        }}
        modalShow={props.modalShow}
        onCancel={handleCancel}>
        <ViewFormPromotion onCancel={handleCancel} data={promotionDetail} type={promotionDetail?.promotionType} />
      </AntModal>
    </HOC>
  );
};

export default connect(null, {
  getPromotionDetail: promotionActions.getPromotionDetail
})(PromotionViewModal);
