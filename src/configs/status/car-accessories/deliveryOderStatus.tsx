import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const DELIVERY_ODER_STATUS = {
  RECEIVED: 'RECEIVED',
  DELIVERED: 'DELIVERED',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING: 'WAITING',
  DONE: 'DONE'
};
/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: phanloi971@gmail.com
 * @Date: 2022-10-21
 */

export const renderDeliveryOderStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    let className;
    switch (status) {
      case DELIVERY_ODER_STATUS.RECEIVED:
        className = StatusCssClasses.success;
        break;
      case DELIVERY_ODER_STATUS.DONE:
        className = StatusCssClasses.primary;
        break;
      case DELIVERY_ODER_STATUS.DELIVERED:
        className = StatusCssClasses.link;
        break;
      case DELIVERY_ODER_STATUS.IN_PROGRESS:
        className = StatusCssClasses.info;
        break;
      case DELIVERY_ODER_STATUS.WAITING:
        className = StatusCssClasses.warning;
        break;
      default:
        className = StatusCssClasses.success;
        break;
    }

    return <span className={`label label-lg label-light-${className} label-inline text-nowrap`}>{localize}</span>;
  }
};
