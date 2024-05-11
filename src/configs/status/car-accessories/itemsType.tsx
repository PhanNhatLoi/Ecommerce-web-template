import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

/**
  this is a test for checking if it working right
*/
export const TEXT_AREA_ROWS = {
  SHORT: 3,
  MEDIUM: 5,
  LONG: 7,
  DOUBLE_LONG: 10
};

export const APPROVE_STATUS = {
  WAITING_FOR_APPROVAL: 'PT_WAITING_FOR_APPROVAL',
  APPROVED: 'PT_APPROVED',
  REJECTED: 'PT_REJECTED'
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderItemsType = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case APPROVE_STATUS.WAITING_FOR_APPROVAL:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case APPROVE_STATUS.APPROVED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case APPROVE_STATUS.REJECTED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      // case ITEMS_TYPE.FURNITURE:
      //   return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
