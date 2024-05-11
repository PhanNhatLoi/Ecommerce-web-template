import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const REPAIR_STATUS = {
  SUCCESS: 'DONE',
  WAITING_FOR_TECHNICIAN_PICKUP_CAR: 'WAITING_FOR_TECHNICIAN_PICKUP_CAR',
  WARNING: 'REPAIRING',
  DANGER: 'CANCELED',
  INFO: 'DONE_CONFIRM_PENDING',
  PRIMARY: 'PAYMENT_PENDING'
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderRepairStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case REPAIR_STATUS.PRIMARY:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case REPAIR_STATUS.INFO:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      case REPAIR_STATUS.WARNING:
      case REPAIR_STATUS.WAITING_FOR_TECHNICIAN_PICKUP_CAR:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case REPAIR_STATUS.SUCCESS:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case REPAIR_STATUS.DANGER:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      case REPAIR_STATUS.LINK:
        return <span className={`label label-lg label-light-${StatusCssClasses.link} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
