import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const TEXT_AREA_ROWS = {
  SHORT: 3,
  MEDIUM: 5,
  LONG: 7,
  DOUBLE_LONG: 10
};

export const CROSS_CHECK_RESULT = {
  NOT_MATCH: 'NOT_MATCH',
  MATCH: 'MATCH'
};

export const CROSS_CHECK = {
  UNCONFIRMED: 'UNCONFIRMED',
  CONFIRMED: 'CONFIRMED'
};

export const CROSS_CHECK_PAYMENT = {
  WAITING_PAYMENT: 'WAITING_PAYMENT',
  SUCCESS: 'SUCCESS'
};

export const renderCrossCheck = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case CROSS_CHECK_RESULT.NOT_MATCH:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      case CROSS_CHECK_RESULT.MATCH:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case CROSS_CHECK.UNCONFIRMED:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      case CROSS_CHECK.CONFIRMED:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case CROSS_CHECK_PAYMENT.WAITING_PAYMENT:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case CROSS_CHECK_PAYMENT.SUCCESS:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
