import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const TRADING_PRODUCT_STATUS_RESPONSE = {
  ACTIVATED: 'ACTIVATED',
  DEACTIVATED: 'DEACTIVATED',
  APPROVED: 'APPROVED',
  BLOCKED: 'BLOCKED',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  REJECT: 'REJECTED'
};

// for product status
export const TRADING_PRODUCT_STATUS = {
  DEACTIVATED: 'P_DEACTIVATED',
  ACTIVATED: 'P_ACTIVATED',
  BLOCKED: 'P_BLOCKED'
};

export const renderTradingProductStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case TRADING_PRODUCT_STATUS.ACTIVATED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case TRADING_PRODUCT_STATUS.DEACTIVATED:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;

      case TRADING_PRODUCT_STATUS.BLOCKED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};

// for approve status
export const TRADING_PRODUCT_APPROVAL_STATUS = {
  WAITING_FOR_APPROVAL: 'PT_WAITING_FOR_APPROVAL',
  APPROVED: 'PT_APPROVED',
  REJECTED: 'PT_REJECTED'
};
export const renderTradingProductApproveStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case TRADING_PRODUCT_APPROVAL_STATUS.APPROVED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case TRADING_PRODUCT_APPROVAL_STATUS.REJECTED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      case TRADING_PRODUCT_APPROVAL_STATUS.WAITING_FOR_APPROVAL:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;

      default:
        return '';
    }
  }
};
