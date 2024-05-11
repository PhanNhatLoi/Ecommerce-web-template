import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const HELP_STATUS = {
  REPAIRED: 'DONE',
  REPAIRING: 'REPAIRING',
  CANCELED: 'CANCELED',
  DONE_CONFIRM_PENDING: 'DONE_CONFIRM_PENDING',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderHelpStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case HELP_STATUS.DONE_CONFIRM_PENDING:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      case HELP_STATUS.REPAIRING:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case HELP_STATUS.CANCELED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      case HELP_STATUS.PAYMENT_PENDING:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case HELP_STATUS.REPAIRED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
