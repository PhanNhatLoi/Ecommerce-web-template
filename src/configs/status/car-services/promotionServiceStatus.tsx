import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const PROMOTION_SERVICE_STATUS: any = {
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

export const PROMOTION_SERVICE_UI_STATUS: any = {
  PENDING: 'PENDING',
  ACTIVATED: 'ACTIVATED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

export const PROMOTION_SERVICE_TYPE: any = {
  OFFER_DISCOUNT: 'OFFER_DISCOUNT',
  COUPON_DISCOUNT: 'COUPON_DISCOUNT'
};

export const PROMOTION_SERVICE_DISCOUNT_TYPE: any = {
  AVAILABLE_PRICE_DISCOUNT: 'AVAILABLE_PRICE_DISCOUNT',
  UNAVAILABLE_PRICE_DISCOUNT: 'UNAVAILABLE_PRICE_DISCOUNT',
  SERVICE_DISCOUNT: 'SERVICE_DISCOUNT',
  COUPON_DISCOUNT: 'COUPON_DISCOUNT'
};

export const PROMOTION_SERVICE_CONDITION_TYPE: any = {
  ORDER_VALUE: 'ORDER_VALUE',
  OTHER: 'OTHER'
};

export const renderPromotionServiceStatus = (status: string, localize: string, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case PROMOTION_SERVICE_STATUS.WAITING_FOR_APPROVAL:
      case PROMOTION_SERVICE_UI_STATUS.PENDING:
      case PROMOTION_SERVICE_DISCOUNT_TYPE.COUPON_DISCOUNT:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case PROMOTION_SERVICE_STATUS.APPROVED:
      case PROMOTION_SERVICE_UI_STATUS.ACTIVATED:
      case PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case PROMOTION_SERVICE_STATUS.REJECTED:
      case PROMOTION_SERVICE_UI_STATUS.REJECTED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      case PROMOTION_SERVICE_STATUS.EXPIRED:
      case PROMOTION_SERVICE_UI_STATUS.EXPIRED:
      case PROMOTION_SERVICE_DISCOUNT_TYPE.UNAVAILABLE_PRICE_DISCOUNT:
        return <span className={`label label-lg label-light-${StatusCssClasses.link} label-inline text-nowrap`}>{localize}</span>;
      case PROMOTION_SERVICE_TYPE.OFFER_DISCOUNT:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case PROMOTION_SERVICE_TYPE.COUPON_DISCOUNT:
      case PROMOTION_SERVICE_DISCOUNT_TYPE.SERVICE_DISCOUNT:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
