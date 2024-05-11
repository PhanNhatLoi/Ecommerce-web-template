import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const REQUEST_STATUS = {
  REJECTED_UPDATED_QUOTATION: 'REJECTED_UPDATED_QUOTATION',
  WAITING: 'WAITING',
  REPAIRED: 'CLOSED'
};

export const BOOKING_TYPE = {
  NOW: 'NOW',
  APPOINTMENT: 'APPOINTMENT'
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderRequestStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case BOOKING_TYPE.NOW:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case REQUEST_STATUS.REJECTED_UPDATED_QUOTATION:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      case REQUEST_STATUS.WAITING:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case REQUEST_STATUS.REPAIRED:
      case BOOKING_TYPE.APPOINTMENT:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
