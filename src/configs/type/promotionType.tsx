import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const PROMOTION_TYPE = {
  INVOICE_DISCOUNT: 'INVOICE_DISCOUNT',
  PRODUCT_DISCOUNT: 'PRODUCT_DISCOUNT',
  CATEGORY_DISCOUNT: 'CATEGORY_DISCOUNT',
  COUPON_DISCOUNT: 'COUPON_DISCOUNT'
};

export const INSURANCE_PROMOTION_TYPE = {
  INSURANCE_PACKAGE_DISCOUNT: 'INSURANCE_PACKAGE_DISCOUNT',
  INSURANCE_COUPON_DISCOUNT: 'INSURANCE_COUPON_DISCOUNT'
};

export const DISCOUNT_UNIT = {
  CASH: 'CASH',
  TRADE: 'TRADE'
};

export const CONVERSION_UNIT = {
  CASH: 'đ',
  TRADE: '%',
  TURN: 'turn'
};

export const STEP_UNIT = {
  VND: 1000,
  PERCENT: 1
};

export const LIMIT_UNIT = {
  MAX_TRADE: 100,
  MIN_TRADE: 0,
  MIN_CASH: 1000,
  MAX_CASH: 1000000000
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: phanloi971@gmail.com
 * @Date: 2022-09-24
 */

export const renderPromotionType = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    let classNamePromotion;
    switch (status) {
      case PROMOTION_TYPE.INVOICE_DISCOUNT:
        classNamePromotion = StatusCssClasses.primary;
        break;
      case PROMOTION_TYPE.PRODUCT_DISCOUNT:
      case INSURANCE_PROMOTION_TYPE.INSURANCE_COUPON_DISCOUNT:
      case DISCOUNT_UNIT.TRADE:
        classNamePromotion = StatusCssClasses.success;
        break;
      case PROMOTION_TYPE.CATEGORY_DISCOUNT:
        classNamePromotion = StatusCssClasses.danger;
        break;
      case PROMOTION_TYPE.COUPON_DISCOUNT:
        classNamePromotion = StatusCssClasses.warning;
        break;
      case DISCOUNT_UNIT.CASH:
        classNamePromotion = StatusCssClasses.info;
        break;
      default:
        classNamePromotion = StatusCssClasses.primary;
        break;
    }
    return <span className={`label label-lg label-light-${classNamePromotion} label-inline text-nowrap`}>{localize}</span>;
  }
};
