import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const PRODUCT_SERVICE_VOUCHER_STATUS = {
  UNREGISTERED: 'UNREGISTERED',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export const renderProductServiceVoucherStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case PRODUCT_SERVICE_VOUCHER_STATUS.UNREGISTERED:
        return <span className={`label label-lg label-light-${StatusCssClasses.link} label-inline text-nowrap`}>{localize}</span>;
      case PRODUCT_SERVICE_VOUCHER_STATUS.WAITING_FOR_APPROVAL:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case PRODUCT_SERVICE_VOUCHER_STATUS.APPROVED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case PRODUCT_SERVICE_VOUCHER_STATUS.REJECTED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
