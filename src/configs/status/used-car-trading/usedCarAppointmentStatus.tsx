import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const USED_CAR_TRADING_APPOINTMENT_STATUS = {
  NEW: 'NEW',
  DONE: 'DONE',
  CANCELED: 'CANCELED'
};

export const renderUsedCarTradingAppointmentStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    let className = '';
    switch (status) {
      case USED_CAR_TRADING_APPOINTMENT_STATUS.NEW:
        className = StatusCssClasses.primary;
        break;
      case USED_CAR_TRADING_APPOINTMENT_STATUS.DONE:
        className = StatusCssClasses.success;
        break;
      case USED_CAR_TRADING_APPOINTMENT_STATUS.CANCELED:
        className = StatusCssClasses.danger;
        break;
    }
    return <span className={`label label-lg label-light-${className} label-inline text-nowrap`}>{localize}</span>;
  }
};
