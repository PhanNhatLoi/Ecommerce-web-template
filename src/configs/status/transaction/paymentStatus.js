import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const PAYMENT_STATUS = {
  WAITING_CONFIRMATION: 'WAITING_CONFIRMATION',
  IN_PROCCESS: 'IN_PROCCESS',
  SUCCESSED: 'SUCCESSED',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
  REJECTED: 'REJECTED'
};

/**
 * THIS IS FUNCTION
 * @Input: status, localize
 * @Output: status render tag or string
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-05-25 18:47:41
 */
export const renderPaymentStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case PAYMENT_STATUS.PAYMENT_PRIMARY:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline`}>{localize}</span>;
      case PAYMENT_STATUS.CANCELED:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline`}>{localize}</span>;
      case PAYMENT_STATUS.WAITING_CONFIRMATION:
      case PAYMENT_STATUS.IN_PROCCESS:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline`}>{localize}</span>;
      case PAYMENT_STATUS.SUCCESSED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline`}>{localize}</span>;
      case PAYMENT_STATUS.FAILED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline`}>{localize}</span>;
      case PAYMENT_STATUS.REJECTED:
        return <span className={`label label-lg label-light-${StatusCssClasses.link} label-inline`}>{localize}</span>;
      default:
        return '';
    }
  }
};
