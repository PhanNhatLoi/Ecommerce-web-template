import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const BANK_ACCOUNT_STATUS = {
  BANK_ACCOUNT_SUCCESS: 'ACTIVATED',
  BANK_ACCOUNT_DANGER: 'DEACTIVATED'
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderBankAccountStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case BANK_ACCOUNT_STATUS.BANK_ACCOUNT_PRIMARY:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline`}>{localize}</span>;
      case BANK_ACCOUNT_STATUS.BANK_ACCOUNT_INFO:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline`}>{localize}</span>;
      case BANK_ACCOUNT_STATUS.BANK_ACCOUNT_WARNING:
        return <span className={`label label-lg label-light-${StatusCssClasses.waring} label-inline`}>{localize}</span>;
      case BANK_ACCOUNT_STATUS.BANK_ACCOUNT_SUCCESS:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline`}>{localize}</span>;
      case BANK_ACCOUNT_STATUS.BANK_ACCOUNT_DANGER:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline`}>{localize}</span>;
      default:
        return '';
    }
  }
};
