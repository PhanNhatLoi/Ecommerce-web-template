import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const MECHANIC_STATUS = {
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export const renderMechanicStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case MECHANIC_STATUS.WAITING_FOR_APPROVAL:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case MECHANIC_STATUS.APPROVED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case MECHANIC_STATUS.REJECTED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      default:
        return localize;
    }
  }
};
