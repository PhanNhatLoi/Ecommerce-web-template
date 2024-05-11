import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const USED_CAR_TRADING_STATUS = {
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  HIDDEN: 'HIDDEN',
  SOLD: 'SOLD'
};

export const renderUsedCarTradingStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    let className = '';
    switch (status) {
      case USED_CAR_TRADING_STATUS.WAITING_FOR_APPROVAL:
        className = StatusCssClasses.warning;
        break;
      case USED_CAR_TRADING_STATUS.APPROVED:
        className = StatusCssClasses.success;
        break;
      case USED_CAR_TRADING_STATUS.REJECTED:
        className = StatusCssClasses.danger;
        break;
      case USED_CAR_TRADING_STATUS.HIDDEN:
        className = StatusCssClasses.link;
        break;
      case USED_CAR_TRADING_STATUS.SOLD:
        className = StatusCssClasses.info;
        break;
    }

    return <span className={`label label-lg label-light-${className} label-inline text-nowrap`}>{localize}</span>;
  }
};
