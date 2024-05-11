import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const PROMOTION_STATUS: any = {
  ACTIVATED: 'ACTIVATED',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  BLOCKED: 'BLOCKED',
  EXPIRED: 'EXPIRED'
  // CANCELED: 'CANCELED'
};
/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: phanloi971@gmail.com
 * @Date: 2022-09-24
 */

export const renderPromotionStatus = (status: string, localize: string, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    let classNamePromotion;
    switch (status) {
      case PROMOTION_STATUS.ACTIVATED:
        classNamePromotion = StatusCssClasses.primary;
        break;
      case PROMOTION_STATUS.WAITING_FOR_APPROVAL:
        classNamePromotion = StatusCssClasses.warning;
        break;
      case PROMOTION_STATUS.APPROVED:
        classNamePromotion = StatusCssClasses.success;
        break;
      case PROMOTION_STATUS.REJECTED:
        classNamePromotion = StatusCssClasses.info;
        break;
      case PROMOTION_STATUS.BLOCKED:
        classNamePromotion = StatusCssClasses.danger;
        break;
      case PROMOTION_STATUS.EXPIRED:
        classNamePromotion = StatusCssClasses.link;
        break;
      default:
        classNamePromotion = StatusCssClasses.dark;
        break;
    }

    return <span className={`label label-lg label-light-${classNamePromotion} label-inline text-nowrap`}>{localize}</span>;
  }
};
