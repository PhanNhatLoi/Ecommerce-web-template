import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import { useTranslation } from 'react-i18next';
import ViewFormPromotion from '../Forms/ViewForm';
import PromotionAddNew from '../Forms/DiscountInfoForm';
import HOC from '~/views/container/HOC';
import { promotionActions } from '~/state/ducks/promotion';
import { PROMOTION_TYPE } from '~/configs/type/promotionType';
import CouponAddNew from '../Forms/CouponInfoForm';
import { PromotionResponse } from '~/state/ducks/promotion/actions';
import { PROMOTION_STATUS } from '~/configs/status/car-accessories/promotionStatus';
import moment from 'moment';

export const PromotionViewModal = (props: {
  data?: PromotionResponse;
  getPromotionDetail: any;
  isEditing: boolean;
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  setViewEdit: React.Dispatch<React.SetStateAction<boolean>>;
  fullAccessPage: boolean;
}) => {
  const { t }: any = useTranslation();
  const [promotionDetail, setPromotionDetail] = useState<PromotionResponse>();
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    if (props?.data) {
      setPromotionDetail(props?.data);
    }
  }, [props?.data]);

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
        title={props.isEditing ? t('promotion_edit') : t('promotion_detail')}
        description={props.isEditing ? t('promotion_edit_des') : t('promotion_detail_des')}
        width={1000}
        destroyOnClose
        supportEdit={
          !props.isEditing &&
          props.fullAccessPage &&
          moment().isBefore(props?.data?.endDate) &&
          !props?.data?.quantityUsed &&
          [PROMOTION_STATUS.ACTIVATED, PROMOTION_STATUS.WAITING_FOR_APPROVAL].includes(props?.data?.status)
        }
        onEdit={() => props.setViewEdit(true)}
        modalShow={props.modalShow}
        onCancel={handleCancel}>
        {props.isEditing ? (
          props?.data?.promotionType === PROMOTION_TYPE.COUPON_DISCOUNT ? (
            <CouponAddNew data={promotionDetail} setDirty={setDirty} />
          ) : (
            <PromotionAddNew data={promotionDetail} dirty={dirty} setDirty={setDirty} />
          )
        ) : (
          <ViewFormPromotion //
            onCancel={handleCancel}
            data={promotionDetail}
            type={props?.data?.promotionType}
          />
        )}
      </AntModal>
    </HOC>
  );
};

export default connect(null, {
  getPromotionDetail: promotionActions.getPromotionDetail
})(PromotionViewModal);
